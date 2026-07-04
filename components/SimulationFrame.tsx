interface SimulationFrameProps {
  htmlPath: string;
  title: string;
}

export function SimulationFrame({ htmlPath, title }: SimulationFrameProps) {
  return (
    <iframe
      src={htmlPath}
      title={title}
      className="h-full w-full flex-1 border-0"
      sandbox="allow-scripts allow-same-origin allow-popups allow-modals allow-forms"
    />
  );
}
