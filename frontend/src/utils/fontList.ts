export interface IFont {
  name: string;
  value: string;
}

export const FontList: IFont[] = [
  { name: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Arial Black", value: "Arial Black, sans-serif" },
  { name: "Verdana", value: "Verdana, sans-serif" },
  { name: "Tahoma", value: "Tahoma, sans-serif" },
  { name: "Trebuchet MS", value: '"Trebuchet MS", sans-serif' },
  { name: "Impact", value: "Impact, sans-serif" },
  {
    name: "Gill Sans",
    value: '"Gill Sans", "Gill Sans MT", Calibri, sans-serif',
  },
  { name: "Times New Roman", value: '"Times New Roman", Times, serif' },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Palatino", value: "Palatino, serif" },
  { name: "Baskerville", value: "Baskerville, serif" },
  { name: "Andalé Mono", value: '"Andale Mono", "Courier New", monospace' },
  { name: "Courier", value: "Courier, monospace" },
  { name: "Lucida", value: '"Lucida Console", Monaco, monospace' },
  { name: "Monaco", value: "Monaco, monospace" },
  { name: "Bradley Hand", value: '"Bradley Hand", cursive' },
  { name: "Brush Script MT", value: '"Brush Script MT", cursive' },
  { name: "Luminari", value: "Luminari, fantasy" },
  { name: "Comic Sans MS", value: '"Comic Sans MS", cursive' },
];
