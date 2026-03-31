type Options = {
	delay: number;
	reset: boolean;
};

export class UseClipboard {
	#copiedStatus = $state<"success" | "failure">();
	delay: number;
	reset: boolean;
	timeout: ReturnType<typeof setTimeout> | undefined = undefined;
	#lastCopied = $state<string | undefined>(undefined);
	constructor({ delay = 2000, reset = true }: Partial<Options> = {}) {
		this.delay = delay;
		this.reset = reset;
	}

	async copy(text: string | number): Promise<"success" | "failure"> {
		if (this.timeout) {
			this.#copiedStatus = undefined;
			clearTimeout(this.timeout);
		}

		this.#copiedStatus = await copyText(text.toString());

		this.timeout = setTimeout(() => {
			this.#copiedStatus = undefined;
		}, this.delay);

		return this.#copiedStatus;
	}

	get copied(): boolean {
		return this.#copiedStatus === "success";
	}

	get status(): "success" | "failure" | undefined {
		return this.#copiedStatus;
	}

	get lastCopied(): string | undefined {
		return this.#lastCopied;
	}
}

export async function copyText(text: string): Promise<"success" | "failure"> {
	try {
		if (navigator.clipboard && window.isSecureContext) {
			await navigator.clipboard.writeText(text);
			return "success";
		}
		const textArea = document.createElement("textarea");
		textArea.value = text;
		textArea.style.position = "fixed";
		textArea.style.top = "0";
		textArea.style.left = "0";
		document.body.appendChild(textArea);
		textArea.select();
		const successful = document.execCommand("copy");
		document.body.removeChild(textArea);
		return successful ? "success" : "failure";
	} catch {
		return "failure";
	}
}
