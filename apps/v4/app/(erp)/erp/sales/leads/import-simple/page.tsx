export default function SimpleImportPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Import Leads</h1>
      <p>Upload a CSV file to import multiple leads at once</p>
      <div className="mt-4">
        <input type="file" accept=".csv" />
        <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded">
          Upload
        </button>
      </div>
    </div>
  )
}