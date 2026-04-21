import { generateStudentCard } from "./lib/card-generator";
import fs from "fs";

async function test() {
  console.log("Generating test card (Centered A4)...");
  try {
    const buffer = await generateStudentCard("OKASHA NADEEM", "BSE-25F-001");
    fs.writeFileSync("test-centered-card.pdf", buffer);
    console.log("Success! Test card saved as: test-centered-card.pdf");
    console.log("Please check the file to verify the centered layout and sizing.");
  } catch (err) {
    console.error("Test generation failed:", err);
  }
}

test();
