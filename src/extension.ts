import * as vscode from "vscode";
import path from "path";
import fs from "fs";
import { validateProblemNumberInput, fetchProblemInfo, createInputTemplate } from "./boj/utils/index";

export function activate(context: vscode.ExtensionContext) {
  // createFile 명령어 등록
  context.subscriptions.push(
    vscode.commands.registerCommand("boj-starter-kit.setupProblem", async () => {
      let problemNumber = await vscode.window.showInputBox({
        prompt: "문제 번호",
        validateInput: validateProblemNumberInput,
      });

      // 문제 번호가 입력되지 않은 경우
      if (!problemNumber) {
        vscode.window.showInformationMessage("문제 번호가 입력 되지 않았습니다.");
        return;
      }

      problemNumber = problemNumber.trim();
      let title = "";

      // 문제 존재하는지 확인하고 제목 가져오기
      try {
        title = await fetchProblemInfo(problemNumber);
      } catch (err) {
        vscode.window.showErrorMessage("존재하지 않는 문제입니다. 올바른 문제 번호를 입력해주세요.");
        return;
      }

      // 현재 workspace 폴더
      const workspaceFolders = vscode.workspace.workspaceFolders;

      if (!workspaceFolders) {
        vscode.window.showErrorMessage("먼저 폴더를 열어주세요.");
        return;
      }

      const folderPath = workspaceFolders[0].uri.fsPath;
      const fileName = `${problemNumber}.js`;
      const filePath = path.join(folderPath, fileName);
      const inputFilePath = path.join(folderPath, "input.txt");

      // 이미 파일이 존재하는 경우
      if (fs.existsSync(filePath)) {
        vscode.window.showErrorMessage("파일이 이미 존재합니다. 다른 문제 번호를 입력해주세요.");
        return;
      }

      // js input boilerplate
      const template = createInputTemplate({ id: problemNumber, title });

      // 생성한 파일에 js boilerplate 작성하여 열기
      fs.writeFile(filePath, template, async (err) => {
        if (err) {
          vscode.window.showErrorMessage("파일 생성에 실패하였습니다.");
          console.error(err);
          return;
        }

        const doc = await vscode.workspace.openTextDocument(filePath);

        vscode.window.showTextDocument(doc);
        vscode.window.showInformationMessage(`${fileName} 파일이 생성되었습니다.`);
      });

      // input.txt가 루트에 없는 경우 생성
      if (!fs.existsSync(inputFilePath)) {
        fs.writeFile(inputFilePath, "", (err) => {
          if (err) {
            vscode.window.showErrorMessage("input.txt 파일 생성에 실패하였습니다.");
            return;
          }
        });
      }
    })
  );
}

export function deactivate() {}
