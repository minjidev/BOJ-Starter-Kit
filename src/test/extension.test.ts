import * as assert from "assert";
import * as vscode from "vscode";
import path from "path";
import { it, describe } from "mocha";
import { validateProblemNumberInput } from "../boj/utils/validateInput";

describe("BOJ StarterKit Extension Tests", () => {
  // 숫자가 아니거나 0보다 작은 경우 에러 메시지 표시
  it("displays error message if problem number is not valid.", () => {
    assert.equal(validateProblemNumberInput("abc"), "정확한 문제 번호를 입력해주세요.");
    assert.equal(validateProblemNumberInput("-10"), "정확한 문제 번호를 입력해주세요.");
    assert.equal(validateProblemNumberInput("\n"), "정확한 문제 번호를 입력해주세요.");
    assert.equal(validateProblemNumberInput("123"), null);
  });

  // input 템플릿과 함께 문제 번호 파일 생성
  it("creates a file with input template.", async () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders) {
      throw Error("No Folder Opened");
    }

    // workspace에 파일 uri 생성
    const folderPath = workspaceFolders[0].uri.fsPath;
    const uri = vscode.Uri.file(path.join(folderPath, "/123.js"));
    const inputUri = vscode.Uri.file(path.join(folderPath, "/input.txt"));

    vscode.window.showInputBox = () => Promise.resolve("123");
    await vscode.commands.executeCommand("boj-starter-kit.setupProblem");

    // 파일 생성 확인
    const doc = await vscode.workspace.openTextDocument(uri);
    const input = await vscode.workspace.openTextDocument(inputUri);

    assert.ok(doc);
    assert.ok(input);
    assert.strictEqual(
      doc.getText().includes("https://www.acmicpc.net/problem/123"),
      true,
      "Document should contain the correct problem URL."
    );

    // cleanup
    await vscode.workspace.fs.delete(uri);
    await vscode.workspace.fs.delete(inputUri);
  });
});
