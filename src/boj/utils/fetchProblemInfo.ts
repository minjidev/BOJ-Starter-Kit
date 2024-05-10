import axios from "axios";
import * as cheerio from "cheerio";
import { BOJ_BASE_URL, UserAgentList } from "../constants/constants";

async function fetchProblemInfo(problemNumber: string) {
  const url = `${BOJ_BASE_URL}/problem/${problemNumber}`;
  const agentIndex = Math.floor(Math.random() * UserAgentList.length);

  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": UserAgentList[agentIndex],
    },
    timeout: 5000,
  });

  const $ = cheerio.load(data);
  const title = $("#problem_title").text();

  if (!title) {
    throw new Error("문제 제목을 찾을 수 없습니다.");
  }

  return title;
}

export default fetchProblemInfo;
