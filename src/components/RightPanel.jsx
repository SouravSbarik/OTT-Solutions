import rightPanelImg from "../../public/right-panel.png"; // put image in src/assets

export default function RightPanel() {
  return (
    // hidden below xl, fixed to the right on xl+
    <aside className="hidden xl:block fixed right-0 top-0 h-full w-80 max-w-[420px]">
      <div className="h-full w-full overflow-hidden">
        {/* If you prefer the image rotated, add class 'rotate-90' */}
        <img
          src={rightPanelImg}
          alt="Decorative Right Panel"
          className="w-full h-full object-cover"
        />
      </div>
    </aside>
  );
}
