interface EditorialDividerProps {
  text: string;
}

export function EditorialDivider({ text }: EditorialDividerProps) {
  return (
    <div className="border-t border-border py-12 lg:py-20">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <p
          className="text-base lg:text-lg font-light italic text-foreground/50"
          style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}
