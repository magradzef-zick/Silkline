export function JsonLd({ data }: { data: object }) {
  // Replace < to prevent </script> injection without adding a sanitizer dependency.
  // JSON.stringify does not escape < by default; < is valid JSON and safe in script tags.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
