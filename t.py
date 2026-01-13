import subprocess
import os
import re
import uuid
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading
import argparse
from shutil import rmtree
import glob
import yaml
import signal

# Add shutdown event
shutdown_event = threading.Event()

parser = argparse.ArgumentParser(
    description="This script requires either --npm or --pnpm flag unless --clean is specified."
)

group = parser.add_mutually_exclusive_group()
group.add_argument("--npm", action="store_true", help="Use npm")
group.add_argument("--pnpm", action="store_true", help="Use pnpm")

parser.add_argument(
    "--clean", action="store_true", help="Delete all folders starting with 'tgz-files'"
)
parser.add_argument(
    "--name", type=str, help="notate folder to help recognize the folder"
)

args = parser.parse_args()

if not args.clean and not (args.npm or args.pnpm):
    parser.error("You must provide either --npm or --pnpm unless --clean is specified.")


def clean_tgz_dirs():
    directories_to_delete = [d for d in glob.glob("tgz-files*") if os.path.isdir(d)]
    if directories_to_delete:
        for directory in directories_to_delete:
            try:
                rmtree(directory)
                print(f"Deleted directory: {directory}")
            except Exception as e:
                print(f"Error deleting {directory}: {e}")
    else:
        print("No directories starting with 'tgz-files' found to delete.")
    exit(0)


if args.clean:
    clean_tgz_dirs()

label = f"{args.name}-" if args.name else ""
PACKED_TGZ_DESTINATION = f"tgz-files-{label}{str(uuid.uuid4())}"
os.mkdir(PACKED_TGZ_DESTINATION)

total_downloaded = 0
total_downloaded_lock = threading.Lock()


def get_packages_from_npm_lock() -> list[str]:
    with open("package-lock.json", "r") as file:
        lockfile = json.loads(file.read())
    data_str = json.dumps(lockfile)
    urls = re.findall(r"https://registry.npmjs.org[^\s\",]+", data_str)
    return urls


def get_packages_from_pnpm_lock() -> list[str]:
    with open("pnpm-lock.yaml", "r") as file:
        lockfile = yaml.safe_load(file)
    packages = lockfile.get("packages", {})
    return [t[0] for t in list(packages.items())]


def get_packges_full_names_versions() -> list[str]:
    if args.npm:
        return get_packages_from_npm_lock()
    if args.pnpm:
        return get_packages_from_pnpm_lock()
    raise AssertionError("no flag was passed")


def log_progress(package_name: str, total_length: int) -> None:
    global total_downloaded
    with total_downloaded_lock:
        total_downloaded += 1
        percentage_done = (total_downloaded / total_length) * 100
    print(
        f"{package_name} downloaded ({total_downloaded} / {total_length} - {percentage_done:.4f}% done)"
    )


def download_package(pkg_name_version: str, total_length: int) -> None:
    if shutdown_event.is_set():
        return

    process = subprocess.Popen(
        ["npm", "pack", pkg_name_version, "--pack-destination", PACKED_TGZ_DESTINATION],
        shell=False,
        stderr=subprocess.DEVNULL,
        stdout=subprocess.DEVNULL,
    )

    while process.poll() is None:
        if shutdown_event.is_set():
            process.terminate()
            try:
                process.wait(timeout=1)
            except subprocess.TimeoutExpired:
                process.kill()
            return

    if not shutdown_event.is_set():
        log_progress(pkg_name_version, total_length)


def signal_handler(signum, frame):
    print("\nShutting down...")
    shutdown_event.set()


# Register the signal handler
signal.signal(signal.SIGINT, signal_handler)

# Load package names and versions from the lockfile
packages_full_names_versions = get_packges_full_names_versions()
total_packages = len(packages_full_names_versions)

# Use ThreadPoolExecutor to download packages in parallel
with ThreadPoolExecutor() as executor:
    try:
        futures = [
            executor.submit(download_package, pkg_name_version, total_packages)
            for pkg_name_version in packages_full_names_versions
        ]

        for future in as_completed(futures):
            if shutdown_event.is_set():
                break
            future.result()  # This will raise any exceptions encountered in the threads

        if shutdown_event.is_set():
            print("Download interrupted.")
            executor.shutdown(wait=False)
        else:
            print(
                f"The packages are all downloaded and can be found in {PACKED_TGZ_DESTINATION}"
            )

    except KeyboardInterrupt:
        shutdown_event.set()
        print("Shutting down...")
        executor.shutdown(wait=False)
