
import { useRef, useState } from 'react';

const TAP_DELAY_MS = 300;
const CHECKBOX_PREPEND = '✅ ';

type Props = {
  text: string;
  handleUpdateText: (val: string) => void;
}

const useTapCheckbox = ({ text, handleUpdateText }: Props) => {
  const [selection, setSelection] = useState<{ start: number, end: number }>({ start: 0, end: 0 });

  const lastTap = useRef(null);
  const tapCount = useRef(0);

  const handleTap = () => {
    const now = Date.now();

    if (lastTap.current && now - lastTap.current < TAP_DELAY_MS) {
      tapCount.current += 1;
    } else {
      tapCount.current = 1;
    }

    lastTap.current = now;
    if (tapCount.current === 2) {

    } else if (tapCount.current === 3) {
      toggleCheckboxOnLine();
      tapCount.current = 0;
    }
  };


  const handleSelectionChange = ({ nativeEvent: { selection } }) => {
    setSelection(selection);
  };

  const toggleCheckboxOnLine = () => {
    const cursorPosition = selection.start;
    let lines = text.split('\n');
    let charCount = 0;
    let lineIndex = 0;

    for (let i = 0;i < lines.length;i++) {
      charCount += lines[i].length + 1;
      if (cursorPosition < charCount) {
        lineIndex = i;
        break;
      }
    }

    let currentLine = lines[lineIndex];

    if (currentLine.startsWith(CHECKBOX_PREPEND)) {
      lines[lineIndex] = currentLine.substring(2);
    } else {
      lines[lineIndex] = CHECKBOX_PREPEND + currentLine;
    }

    handleUpdateText(lines.join('\n'));
  };

  return {
    handleTap,
    selection,
    handleSelectionChange,
  }
}

export default useTapCheckbox