import RichTextEditor from "@mantine/rte";

export default function RTE({ value, onChange, controls, editable }) {
  return (
    <RichTextEditor
      controls={controls}
      spellCheck={false}
      contentEditable={editable}
      value={value}
      onChange={onChange}
    />
  );
}
