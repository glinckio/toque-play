import svgPaths from "./svg-3y3k835eem";
type NavbarProps = {
  className?: string;
  property1?: "Home" | "Highlights" | "News" | "User";
};

export default function Navbar({ className, property1 = "Home" }: NavbarProps) {
  const isHighlights = property1 === "Highlights";
  const isHome = property1 === "Home";
  const isNews = property1 === "News";
  return (
    <div className={className || "content-stretch flex items-start overflow-clip relative w-[358px]"}>
      <div className="flex items-center justify-center relative self-stretch shrink-0">
        <div className="-scale-y-100 flex-none h-full rotate-180">
          <div className="h-full relative w-[13px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 48">
              <foreignObject height="0" width="0" x="0" y="0">
                <div style={{ backdropFilter: "blur(6px)", clipPath: "url(#bgblur_0_1_2490_clip_path)", height: "100%", width: "100%" }} xmlns="http://www.w3.org/1999/xhtml" />
              </foreignObject>
              <path d="M0 0L13 24L0 48V0Z" fill="var(--fill-0, white)" id="Rectangle 6" data-figma-bg-blur-radius="12" />
              <defs>
                <clipPath id="bgblur_0_1_2490_clip_path" transform="translate(0 0)">
                  <path d="M0 0L13 24L0 48V0Z" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      <div className="bg-white flex-[1_0_0] h-[48px] min-w-px relative">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-between px-[32px] py-[8px] relative size-full">
            {["News", "Highlights", "User"].includes(property1) && (
              <div className="relative shrink-0 size-[24px]" data-name="ri:home-6-line">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <g id="ri:home-6-line">
                    <path d={svgPaths.p15c71780} fill="var(--fill-0, #150000)" id="Vector" />
                  </g>
                </svg>
              </div>
            )}
            {["Highlights", "User"].includes(property1) && (
              <div className="relative shrink-0 size-[24px]" data-name="ion:newspaper-outline">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <g id="ion:newspaper-outline">
                    <path d={svgPaths.p37933f80} id="Vector" stroke="var(--stroke-0, #150000)" strokeLinejoin="round" strokeWidth="1.5" />
                    <path d={svgPaths.p13eaeb00} id="Vector_2" stroke="var(--stroke-0, #150000)" strokeLinejoin="round" strokeWidth="1.5" />
                    <path d={svgPaths.p3d91d300} id="Vector_3" stroke="var(--stroke-0, #150000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    <path d={svgPaths.p1591200} fill="var(--fill-0, #150000)" id="Vector_4" />
                  </g>
                </svg>
              </div>
            )}
            {isHome && (
              <>
                <div className="relative shrink-0 size-[24px]" data-name="ri:home-6-fill">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <g id="ri:home-6-fill">
                      <path d={svgPaths.p1eaa5cc0} fill="var(--fill-0, #FF5050)" id="Vector" />
                    </g>
                  </svg>
                </div>
                <div className="relative shrink-0 size-[24px]" data-name="ion:newspaper-outline">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <g id="ion:newspaper-outline">
                      <path d={svgPaths.p37933f80} id="Vector" stroke="var(--stroke-0, #150000)" strokeLinejoin="round" strokeWidth="1.5" />
                      <path d={svgPaths.p13eaeb00} id="Vector_2" stroke="var(--stroke-0, #150000)" strokeLinejoin="round" strokeWidth="1.5" />
                      <path d={svgPaths.p3d91d300} id="Vector_3" stroke="var(--stroke-0, #150000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                      <path d={svgPaths.p1591200} fill="var(--fill-0, #150000)" id="Vector_4" />
                    </g>
                  </svg>
                </div>
              </>
            )}
            {["Home", "User"].includes(property1) && (
              <div className="relative shrink-0 size-[24px]" data-name="mdi:clipboard-play-multiple-outline">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <g id="mdi:clipboard-play-multiple-outline">
                    <path d={svgPaths.p16ad9400} fill="var(--fill-0, #150000)" id="Vector" />
                  </g>
                </svg>
              </div>
            )}
            {isHome && (
              <div className="relative shrink-0 size-[24px]" data-name="ri:user-3-line">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <g id="ri:user-3-line">
                    <path d={svgPaths.p2c831180} fill="var(--fill-0, #150000)" id="Vector" />
                  </g>
                </svg>
              </div>
            )}
            {isNews && (
              <>
                <div className="relative shrink-0 size-[24px]" data-name="ion:newspaper-sharp">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <g id="ion:newspaper-sharp">
                      <g id="Vector" />
                      <path d={svgPaths.p2bebfc80} fill="var(--fill-0, #FF5050)" id="Vector_2" />
                      <path d={svgPaths.p166a7000} fill="var(--fill-0, #FF5050)" id="Vector_3" />
                    </g>
                  </svg>
                </div>
                <div className="relative shrink-0 size-[24px]" data-name="mdi:clipboard-play-multiple-outline">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <g id="mdi:clipboard-play-multiple-outline">
                      <path d={svgPaths.p16ad9400} fill="var(--fill-0, #150000)" id="Vector" />
                    </g>
                  </svg>
                </div>
                <div className="relative shrink-0 size-[24px]" data-name="ri:user-3-line">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <g id="ri:user-3-line">
                      <path d={svgPaths.p2c831180} fill="var(--fill-0, #150000)" id="Vector" />
                    </g>
                  </svg>
                </div>
              </>
            )}
            {isHighlights && (
              <>
                <div className="relative shrink-0 size-[24px]" data-name="mdi:clipboard-play-multiple">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <g id="mdi:clipboard-play-multiple">
                      <path d={svgPaths.p16723080} fill="var(--fill-0, #FF5050)" id="Vector" />
                    </g>
                  </svg>
                </div>
                <div className="relative shrink-0 size-[24px]" data-name="ri:user-3-line">
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <g id="ri:user-3-line">
                      <path d={svgPaths.p2c831180} fill="var(--fill-0, #150000)" id="Vector" />
                    </g>
                  </svg>
                </div>
              </>
            )}
            {property1 === "User" && (
              <div className="relative shrink-0 size-[24px]" data-name="ri:user-3-fill">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <g id="ri:user-3-fill">
                    <path d={svgPaths.p1418d380} fill="var(--fill-0, #FF5050)" id="Vector" />
                  </g>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="relative self-stretch shrink-0 w-[13px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 48">
          <foreignObject height="0" width="0" x="0" y="0">
            <div style={{ backdropFilter: "blur(6px)", clipPath: "url(#bgblur_0_1_2481_clip_path)", height: "100%", width: "100%" }} xmlns="http://www.w3.org/1999/xhtml" />
          </foreignObject>
          <path d="M0 0L13 24L0 48V0Z" fill="var(--fill-0, white)" id="Rectangle 5" data-figma-bg-blur-radius="12" />
          <defs>
            <clipPath id="bgblur_0_1_2481_clip_path" transform="translate(0 0)">
              <path d="M0 0L13 24L0 48V0Z" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
}