import path from "path"
import {
  type Transformer,
  type TransformOpts,
} from "@shadcn/registry/internal/utils/transformers/index"
import { Project, ScriptKind, type SourceFile } from "ts-morph"

// A transformer that edits a ts-morph SourceFile in place: the signature the
// registry's transformers had, which shadcn/utils keeps.
export type SourceFileTransformer = (
  opts: TransformOpts & {
    sourceFile: SourceFile
  }
) => Promise<SourceFile>

// Runs a registry transformer, which takes and returns text, on a SourceFile:
// on its full text, which the result then replaces.
export function fromTextTransformer(
  transform: Transformer
): SourceFileTransformer {
  return async ({ sourceFile, ...opts }) => {
    setFullText(sourceFile, await transform(sourceFile.getFullText(), opts))
    return sourceFile
  }
}

// Writes text into the SourceFile when it differs from its full text.
// SourceFile#replaceWithText() and replaceText() write through ts-morph's code
// writer, which turns CRLF into LF. applyTextChanges() writes the text as it
// is, and like any ts-morph edit parses the file again, so the next
// transformer finds the tree it would have.
function setFullText(sourceFile: SourceFile, text: string) {
  const fullText = sourceFile.getFullText()
  if (text !== fullText) {
    sourceFile.applyTextChanges([
      { span: { start: 0, length: fullText.length }, newText: text },
    ])
  }
}

const project = new Project({
  compilerOptions: {},
  useInMemoryFileSystem: true,
})
let files = 0

// Runs a SourceFile transformer in the registry's transform(), which works on
// text: on a SourceFile created from the text, as the registry's runner did
// before it dropped ts-morph, whose full text is the result.
export function toTextTransformer(
  transform: SourceFileTransformer
): Transformer {
  return async (code, opts) => {
    // Each file in a directory of its own, as the runner's temp directories,
    // so transforms that run at the same time keep their own SourceFile.
    const sourceFile = project.createSourceFile(
      path.join(`/shadcn-${++files}`, path.basename(opts.filename)),
      code,
      { scriptKind: ScriptKind.TSX }
    )

    try {
      await transform({ ...opts, sourceFile })
      return sourceFile.getFullText()
    } finally {
      project.removeSourceFile(sourceFile)
    }
  }
}
