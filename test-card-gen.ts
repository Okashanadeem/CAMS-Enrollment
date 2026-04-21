import { generateStudentCard } from "./lib/card-generator";
import fs from "fs";

async function test() {
  console.log("Testing card generation...");
  try {
    const buffer = await generateStudentCard("OKASHA NADEEM", "BSE-25F-001");
    fs.writeFileSync("test-card.pdf", buffer);
    console.log("Card generated successfully: test-card.pdf");
  } catch (err) {
    console.error("Test failed:", err);
  }
}

test();
