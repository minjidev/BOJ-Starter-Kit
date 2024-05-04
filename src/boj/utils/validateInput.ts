export function validateProblemNumberInput(input: string) {
  const isProblemNumberValid = /^\d+$/.test(input) && +input > 0;

  return !isProblemNumberValid ? "정확한 문제 번호를 입력해주세요." : null;
}
