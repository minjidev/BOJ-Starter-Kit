import { BOJ_BASE_URL } from "../constants/constants";

interface Problem {
  id: string;
  title: string;
}

function createInputTemplate({ id, title }: Problem) {
  return `// [${id}/${title}](${BOJ_BASE_URL}/problem/${id})

const fs = require("fs");
const filePath = process.platform === "linux" ? "/dev/stdin" : "./input.txt";
let input = fs.readFileSync(filePath).toString().trim().split("\\n");
`;
}

export default createInputTemplate;
