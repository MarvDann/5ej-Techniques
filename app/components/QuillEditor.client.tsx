import ReactQuill from 'react-quill'

interface Props {
  value: string
  onChange: (value: string) => void
}

const modules = {
  toolbar: [
    ['bold', 'underline', 'italic'],
    ['code-block', 'blockquote'],
    [{ header: [1, 2, 3, 4, 5] }],
    [{ list: 'ordered' }],
    [{ list: 'bullet' }],
  ],
}

export default function QuillEditor({ onChange, value }: Props) {
  return (
    <div className="h-full">
      <ReactQuill
        theme="snow"
        onChange={onChange}
        value={value}
        modules={modules}
        style={{ height: '14em', paddingBottom: '2em' }}
      />
    </div>
  )
}
