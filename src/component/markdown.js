import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, IconButton, ButtonGroup } from "@mui/material";
import { FormatBold, FormatItalic, FormatUnderlined, Code, FormatListBulleted } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import Styles from "../styles/markdown.module.css";

function MarkdownEditor() {
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState('');

  const handleMarkdownChange = async (e) => {
    const input = e.target.value;
    setMarkdown(input);
    try {
      if (input.trim() === '') {
        setHtml('');
      } else {
        const response = await axios.post('http://localhost:5000/convert', { markdown: input });
        setHtml(response.data.html);
      }
    } catch (error) {
      console.error('Error converting markdown:', error);
    }
  };
  const applyFormatting = (formatType) => {
    const selectedText = window.getSelection().toString();
    if (!selectedText) return;

    let formattedText;
    switch (formatType) {
      case "bold":
        formattedText = `**${selectedText}**`;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        break;
      case "underline":
        formattedText = `<u>${selectedText}</u>`;
        break;
      case "code":
        formattedText = `\`${selectedText}\``;
        break;
      case "list":
        formattedText = `- ${selectedText}`;
        break;
      default:
        return;
    }

    const updatedMarkdown = markdown.replace(selectedText, formattedText);
    setMarkdown(updatedMarkdown);
  };

  return (
    <Box className={Styles.container}>
      <Box className={Styles.header}>
        <Typography variant="h6" className={Styles.editorHeading}>
          Markdown Editor
        </Typography>
      </Box>

      <Box className={Styles.content}>
        <Box className={Styles.editor}>
          <ButtonGroup className={Styles.buttonGroup} variant="text">
            <IconButton onClick={() => applyFormatting("bold")}>
              <FormatBold />
            </IconButton>
            <IconButton onClick={() => applyFormatting("italic")}>
              <FormatItalic />
            </IconButton>
            <IconButton onClick={() => applyFormatting("underline")}>
              <FormatUnderlined />
            </IconButton>
            <IconButton onClick={() => applyFormatting("code")}>
              <Code />
            </IconButton>
            <IconButton onClick={() => applyFormatting("list")}>
              <FormatListBulleted />
            </IconButton>
          </ButtonGroup>
          <textarea
            value={markdown}
            onChange={handleMarkdownChange}
            className={Styles.textarea}
            placeholder="Write your markdown here..."
          />
        </Box>

        <Box className={Styles.preview}>
          <Typography variant="h6" className={Styles.previewHeading}>
            Preview
          </Typography>
          <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkBreaks]}>{markdown}</ReactMarkdown>
        </Box>
      </Box>
    </Box>
  );
}

export default MarkdownEditor;
