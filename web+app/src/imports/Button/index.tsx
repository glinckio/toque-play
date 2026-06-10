import svgPaths from "./svg-uty3ey0lmm";
type ButtonProps = {
  className?: string;
  icon?: "None" | "Right" | "Left" | "Icon Only";
  size?: "Samll" | "Medium" | "Large";
  state?: "Default" | "Pressed" | "Disable";
  type?: "Filled" | "Ghost";
};

export default function Button({ className, icon = "None", size = "Samll", state = "Default", type = "Filled" }: ButtonProps) {
  if (state === "Default" && icon === "None" && size === "Samll" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex h-[32px] items-center justify-center relative"} data-name="State=Default, Icon=None, Size=Samll, Type=Ghost">
        <div className="content-stretch flex h-[32px] items-center justify-center py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#150000] text-[14px] whitespace-nowrap">Button</p>
        </div>
      </div>
    );
  }
  if (state === "Default" && icon === "None" && size === "Medium" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Default, Icon=None, Size=Medium, Type=Filled">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-center justify-center relative shrink-0">
            <div className="-scale-y-100 flex-none h-full rotate-180">
              <div className="h-full relative w-[8px]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 40">
                  <path d="M0 0L8 20L0 40V0Z" fill="var(--fill-0, #150000)" id="Rectangle 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#150000] content-stretch flex h-[40px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[14px] whitespace-nowrap">Button</p>
        </div>
        <div className="flex flex-row items-center self-stretch">
          <div className="h-full relative shrink-0 w-[8px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 40">
              <path d="M0 0L8 20L0 40V0Z" fill="var(--fill-0, #150000)" id="Rectangle 7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Default" && icon === "None" && size === "Medium" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Default, Icon=None, Size=Medium, Type=Ghost">
        <div className="content-stretch flex h-[40px] items-center justify-center py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#150000] text-[14px] whitespace-nowrap">Button</p>
        </div>
      </div>
    );
  }
  if (state === "Default" && icon === "None" && size === "Large" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Default, Icon=None, Size=Large, Type=Filled">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-center justify-center relative shrink-0">
            <div className="-scale-y-100 flex-none h-full rotate-180">
              <div className="h-full relative w-[8px]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 48">
                  <path d="M0 0L8 24L0 48V0Z" fill="var(--fill-0, #150000)" id="Rectangle 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#150000] content-stretch flex h-[48px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[14px] whitespace-nowrap">Button</p>
        </div>
        <div className="flex flex-row items-center self-stretch">
          <div className="h-full relative shrink-0 w-[8px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 48">
              <path d="M0 0L8 24L0 48V0Z" fill="var(--fill-0, #150000)" id="Rectangle 7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Default" && icon === "None" && size === "Large" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Default, Icon=None, Size=Large, Type=Ghost">
        <div className="content-stretch flex h-[48px] items-center justify-center py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#150000] text-[14px] whitespace-nowrap">Button</p>
        </div>
      </div>
    );
  }
  if (state === "Default" && icon === "Icon Only" && size === "Samll" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex h-[32px] items-center justify-center relative"} data-name="State=Default, Icon=Icon Only, Size=Samll, Type=Filled">
        <div className="flex h-full items-center justify-center relative shrink-0">
          <div className="-scale-y-100 flex-none h-full rotate-180">
            <div className="h-full relative w-[8px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
                <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #150000)" id="Rectangle 6" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-[#150000] content-stretch flex h-[32px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full relative shrink-0 w-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
            <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #150000)" id="Rectangle 7" />
          </svg>
        </div>
      </div>
    );
  }
  if (state === "Default" && icon === "Icon Only" && size === "Samll" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex h-[32px] items-center justify-center relative"} data-name="State=Default, Icon=Icon Only, Size=Samll, Type=Ghost">
        <div className="content-stretch flex h-[32px] items-center justify-center py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #150000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Pressed" && icon === "None" && size === "Samll" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex h-[32px] items-center justify-center relative"} data-name="State=Pressed, Icon=None, Size=Samll, Type=Filled">
        <div className="flex h-full items-center justify-center relative shrink-0">
          <div className="-scale-y-100 flex-none h-full rotate-180">
            <div className="h-full relative w-[8px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
                <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #2F0000)" id="Rectangle 6" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-[#2f0000] content-stretch flex h-[32px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[14px] whitespace-nowrap">Button</p>
        </div>
        <div className="h-full relative shrink-0 w-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
            <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #2F0000)" id="Rectangle 7" />
          </svg>
        </div>
      </div>
    );
  }
  if (state === "Pressed" && icon === "None" && size === "Samll" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex h-[32px] items-center justify-center relative"} data-name="State=Pressed, Icon=None, Size=Samll, Type=Ghost">
        <div className="content-stretch flex h-[32px] items-center justify-center py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#060000] text-[14px] whitespace-nowrap">Button</p>
        </div>
      </div>
    );
  }
  if (state === "Pressed" && icon === "None" && size === "Medium" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Pressed, Icon=None, Size=Medium, Type=Filled">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-center justify-center relative shrink-0">
            <div className="-scale-y-100 flex-none h-full rotate-180">
              <div className="h-full relative w-[8px]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 40">
                  <path d="M0 0L8 20L0 40V0Z" fill="var(--fill-0, #060000)" id="Rectangle 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#060000] content-stretch flex h-[40px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[14px] whitespace-nowrap">Button</p>
        </div>
        <div className="flex flex-row items-center self-stretch">
          <div className="h-full relative shrink-0 w-[8px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 40">
              <path d="M0 0L8 20L0 40V0Z" fill="var(--fill-0, #060000)" id="Rectangle 7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Pressed" && icon === "None" && size === "Medium" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Pressed, Icon=None, Size=Medium, Type=Ghost">
        <div className="content-stretch flex h-[40px] items-center justify-center py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#060000] text-[14px] whitespace-nowrap">Button</p>
        </div>
      </div>
    );
  }
  if (state === "Pressed" && icon === "None" && size === "Large" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Pressed, Icon=None, Size=Large, Type=Filled">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-center justify-center relative shrink-0">
            <div className="-scale-y-100 flex-none h-full rotate-180">
              <div className="h-full relative w-[8px]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 48">
                  <path d="M0 0L8 24L0 48V0Z" fill="var(--fill-0, #060000)" id="Rectangle 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#060000] content-stretch flex h-[48px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[14px] whitespace-nowrap">Button</p>
        </div>
        <div className="flex flex-row items-center self-stretch">
          <div className="h-full relative shrink-0 w-[8px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 48">
              <path d="M0 0L8 24L0 48V0Z" fill="var(--fill-0, #060000)" id="Rectangle 7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Pressed" && icon === "None" && size === "Large" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Pressed, Icon=None, Size=Large, Type=Ghost">
        <div className="content-stretch flex h-[48px] items-center justify-center py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#060000] text-[14px] whitespace-nowrap">Button</p>
        </div>
      </div>
    );
  }
  if (state === "Pressed" && icon === "Icon Only" && size === "Samll" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex h-[32px] items-center justify-center relative"} data-name="State=Pressed, Icon=Icon Only, Size=Samll, Type=Filled">
        <div className="flex h-full items-center justify-center relative shrink-0">
          <div className="-scale-y-100 flex-none h-full rotate-180">
            <div className="h-full relative w-[8px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
                <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #060000)" id="Rectangle 6" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-[#060000] content-stretch flex h-[32px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full relative shrink-0 w-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
            <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #060000)" id="Rectangle 7" />
          </svg>
        </div>
      </div>
    );
  }
  if (state === "Pressed" && icon === "Icon Only" && size === "Samll" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex h-[32px] items-center justify-center relative"} data-name="State=Pressed, Icon=Icon Only, Size=Samll, Type=Ghost">
        <div className="content-stretch flex h-[32px] items-center justify-center py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #060000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Disable" && icon === "None" && size === "Samll" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex h-[32px] items-center justify-center relative w-[81px]"} data-name="State=Disable, Icon=None, Size=Samll, Type=Filled">
        <div className="flex h-full items-center justify-center relative shrink-0">
          <div className="-scale-y-100 flex-none h-full rotate-180">
            <div className="h-full relative w-[8px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
                <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 6" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-[#d6d5d5] content-stretch flex h-[32px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#adabab] text-[14px] whitespace-nowrap">Button</p>
        </div>
        <div className="h-full relative shrink-0 w-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
            <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 7" />
          </svg>
        </div>
      </div>
    );
  }
  if (state === "Disable" && icon === "None" && size === "Samll" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex h-[32px] items-center justify-center relative w-[81px]"} data-name="State=Disable, Icon=None, Size=Samll, Type=Ghost">
        <div className="content-stretch flex h-[32px] items-center justify-center py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#adabab] text-[14px] whitespace-nowrap">Button</p>
        </div>
      </div>
    );
  }
  if (state === "Disable" && icon === "None" && size === "Medium" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Disable, Icon=None, Size=Medium, Type=Filled">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-center justify-center relative shrink-0">
            <div className="-scale-y-100 flex-none h-full rotate-180">
              <div className="h-full relative w-[8px]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 40">
                  <path d="M0 0L8 20L0 40V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#d6d5d5] content-stretch flex h-[40px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#adabab] text-[14px] whitespace-nowrap">Button</p>
        </div>
        <div className="flex flex-row items-center self-stretch">
          <div className="h-full relative shrink-0 w-[8px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 40">
              <path d="M0 0L8 20L0 40V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Disable" && icon === "None" && size === "Medium" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Disable, Icon=None, Size=Medium, Type=Ghost">
        <div className="content-stretch flex h-[40px] items-center justify-center py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#adabab] text-[14px] whitespace-nowrap">Button</p>
        </div>
      </div>
    );
  }
  if (state === "Disable" && icon === "None" && size === "Large" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Disable, Icon=None, Size=Large, Type=Filled">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-center justify-center relative shrink-0">
            <div className="-scale-y-100 flex-none h-full rotate-180">
              <div className="h-full relative w-[8px]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 48">
                  <path d="M0 0L8 24L0 48V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#d6d5d5] content-stretch flex h-[48px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#adabab] text-[14px] whitespace-nowrap">Button</p>
        </div>
        <div className="flex flex-row items-center self-stretch">
          <div className="h-full relative shrink-0 w-[8px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 48">
              <path d="M0 0L8 24L0 48V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Disable" && icon === "None" && size === "Large" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Disable, Icon=None, Size=Large, Type=Ghost">
        <div className="content-stretch flex h-[48px] items-center justify-center py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#adabab] text-[14px] whitespace-nowrap">Button</p>
        </div>
      </div>
    );
  }
  if (state === "Disable" && icon === "Icon Only" && size === "Samll" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex h-[32px] items-center justify-center relative"} data-name="State=Disable, Icon=Icon Only, Size=Samll, Type=Filled">
        <div className="flex h-full items-center justify-center relative shrink-0">
          <div className="-scale-y-100 flex-none h-full rotate-180">
            <div className="h-full relative w-[8px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
                <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 6" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-[#d6d5d5] content-stretch flex h-[32px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #ADABAB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full relative shrink-0 w-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
            <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 7" />
          </svg>
        </div>
      </div>
    );
  }
  if (state === "Disable" && icon === "Icon Only" && size === "Samll" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex h-[32px] items-center justify-center relative"} data-name="State=Disable, Icon=Icon Only, Size=Samll, Type=Ghost">
        <div className="content-stretch flex h-[32px] items-center justify-center py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #ADABAB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Default" && icon === "Right" && size === "Samll" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex h-[32px] items-center justify-center relative"} data-name="State=Default, Icon=Right, Size=Samll, Type=Filled">
        <div className="flex h-full items-center justify-center relative shrink-0">
          <div className="-scale-y-100 flex-none h-full rotate-180">
            <div className="h-full relative w-[8px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
                <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #150000)" id="Rectangle 6" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-[#150000] content-stretch flex gap-[4px] h-[32px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[14px] whitespace-nowrap">Button</p>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full relative shrink-0 w-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
            <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #150000)" id="Rectangle 7" />
          </svg>
        </div>
      </div>
    );
  }
  if (state === "Default" && icon === "Right" && size === "Samll" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex h-[32px] items-center justify-center relative"} data-name="State=Default, Icon=Right, Size=Samll, Type=Ghost">
        <div className="content-stretch flex gap-[4px] h-[32px] items-center justify-center py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#150000] text-[14px] whitespace-nowrap">Button</p>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #150000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Default" && icon === "Right" && size === "Medium" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Default, Icon=Right, Size=Medium, Type=Filled">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-center justify-center relative shrink-0">
            <div className="-scale-y-100 flex-none h-full rotate-180">
              <div className="h-full relative w-[8px]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 40">
                  <path d="M0 0L8 20L0 40V0Z" fill="var(--fill-0, #150000)" id="Rectangle 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#150000] content-stretch flex gap-[4px] h-[40px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[14px] whitespace-nowrap">Button</p>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center self-stretch">
          <div className="h-full relative shrink-0 w-[8px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 40">
              <path d="M0 0L8 20L0 40V0Z" fill="var(--fill-0, #150000)" id="Rectangle 7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Default" && icon === "Right" && size === "Medium" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Default, Icon=Right, Size=Medium, Type=Ghost">
        <div className="content-stretch flex gap-[4px] h-[40px] items-center justify-center py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#150000] text-[14px] whitespace-nowrap">Button</p>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #150000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Default" && icon === "Right" && size === "Large" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Default, Icon=Right, Size=Large, Type=Filled">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-center justify-center relative shrink-0">
            <div className="-scale-y-100 flex-none h-full rotate-180">
              <div className="h-full relative w-[8px]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 48">
                  <path d="M0 0L8 24L0 48V0Z" fill="var(--fill-0, #150000)" id="Rectangle 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#150000] content-stretch flex gap-[4px] h-[48px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[14px] whitespace-nowrap">Button</p>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center self-stretch">
          <div className="h-full relative shrink-0 w-[8px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 48">
              <path d="M0 0L8 24L0 48V0Z" fill="var(--fill-0, #150000)" id="Rectangle 7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Default" && icon === "Right" && size === "Large" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Default, Icon=Right, Size=Large, Type=Ghost">
        <div className="content-stretch flex gap-[4px] h-[48px] items-center justify-center py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#150000] text-[14px] whitespace-nowrap">Button</p>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #150000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Default" && icon === "Icon Only" && size === "Medium" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex h-[40px] items-center justify-center relative"} data-name="State=Default, Icon=Icon Only, Size=Medium, Type=Filled">
        <div className="flex h-full items-center justify-center relative shrink-0">
          <div className="-scale-y-100 flex-none h-full rotate-180">
            <div className="h-full relative w-[8px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 40">
                <path d="M0 0L8 20L0 40V0Z" fill="var(--fill-0, #150000)" id="Rectangle 6" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-[#150000] content-stretch flex h-[40px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full relative shrink-0 w-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 40">
            <path d="M0 0L8 20L0 40V0Z" fill="var(--fill-0, #150000)" id="Rectangle 7" />
          </svg>
        </div>
      </div>
    );
  }
  if (state === "Default" && icon === "Icon Only" && size === "Medium" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex h-[40px] items-center justify-center relative"} data-name="State=Default, Icon=Icon Only, Size=Medium, Type=Ghost">
        <div className="content-stretch flex h-[40px] items-center justify-center py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #150000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Pressed" && icon === "Right" && size === "Samll" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex h-[32px] items-center justify-center relative"} data-name="State=Pressed, Icon=Right, Size=Samll, Type=Filled">
        <div className="flex h-full items-center justify-center relative shrink-0">
          <div className="-scale-y-100 flex-none h-full rotate-180">
            <div className="h-full relative w-[8px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
                <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #060000)" id="Rectangle 6" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-[#060000] content-stretch flex gap-[4px] h-[32px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[14px] whitespace-nowrap">Button</p>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full relative shrink-0 w-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
            <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #060000)" id="Rectangle 7" />
          </svg>
        </div>
      </div>
    );
  }
  if (state === "Pressed" && icon === "Right" && size === "Samll" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex h-[32px] items-center justify-center relative"} data-name="State=Pressed, Icon=Right, Size=Samll, Type=Ghost">
        <div className="content-stretch flex gap-[4px] h-[32px] items-center justify-center py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#060000] text-[14px] whitespace-nowrap">Button</p>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #060000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Pressed" && icon === "Right" && size === "Medium" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Pressed, Icon=Right, Size=Medium, Type=Filled">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-center justify-center relative shrink-0">
            <div className="-scale-y-100 flex-none h-full rotate-180">
              <div className="h-full relative w-[8px]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 40">
                  <path d="M0 0L8 20L0 40V0Z" fill="var(--fill-0, #060000)" id="Rectangle 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#060000] content-stretch flex gap-[4px] h-[40px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[14px] whitespace-nowrap">Button</p>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center self-stretch">
          <div className="h-full relative shrink-0 w-[8px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 40">
              <path d="M0 0L8 20L0 40V0Z" fill="var(--fill-0, #060000)" id="Rectangle 7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Pressed" && icon === "Right" && size === "Medium" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Pressed, Icon=Right, Size=Medium, Type=Ghost">
        <div className="content-stretch flex gap-[4px] h-[40px] items-center justify-center py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#060000] text-[14px] whitespace-nowrap">Button</p>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #060000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Pressed" && icon === "Right" && size === "Large" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Pressed, Icon=Right, Size=Large, Type=Filled">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-center justify-center relative shrink-0">
            <div className="-scale-y-100 flex-none h-full rotate-180">
              <div className="h-full relative w-[8px]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 48">
                  <path d="M0 0L8 24L0 48V0Z" fill="var(--fill-0, #060000)" id="Rectangle 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#060000] content-stretch flex gap-[4px] h-[48px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[14px] whitespace-nowrap">Button</p>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center self-stretch">
          <div className="h-full relative shrink-0 w-[8px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 48">
              <path d="M0 0L8 24L0 48V0Z" fill="var(--fill-0, #060000)" id="Rectangle 7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Pressed" && icon === "Right" && size === "Large" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Pressed, Icon=Right, Size=Large, Type=Ghost">
        <div className="content-stretch flex gap-[4px] h-[48px] items-center justify-center py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#060000] text-[14px] whitespace-nowrap">Button</p>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #060000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Pressed" && icon === "Icon Only" && size === "Medium" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex h-[40px] items-center justify-center relative"} data-name="State=Pressed, Icon=Icon Only, Size=Medium, Type=Filled">
        <div className="flex h-full items-center justify-center relative shrink-0">
          <div className="-scale-y-100 flex-none h-full rotate-180">
            <div className="h-full relative w-[8px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 40">
                <path d="M0 0L8 20L0 40V0Z" fill="var(--fill-0, #060000)" id="Rectangle 6" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-[#060000] content-stretch flex h-[40px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full relative shrink-0 w-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 40">
            <path d="M0 0L8 20L0 40V0Z" fill="var(--fill-0, #060000)" id="Rectangle 7" />
          </svg>
        </div>
      </div>
    );
  }
  if (state === "Pressed" && icon === "Icon Only" && size === "Medium" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex h-[40px] items-center justify-center relative"} data-name="State=Pressed, Icon=Icon Only, Size=Medium, Type=Ghost">
        <div className="content-stretch flex h-[40px] items-center justify-center py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #060000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Disable" && icon === "Right" && size === "Samll" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex h-[32px] items-center justify-center relative"} data-name="State=Disable, Icon=Right, Size=Samll, Type=Filled">
        <div className="flex h-full items-center justify-center relative shrink-0">
          <div className="-scale-y-100 flex-none h-full rotate-180">
            <div className="h-full relative w-[8px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
                <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 6" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-[#d6d5d5] content-stretch flex gap-[4px] h-[32px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#adabab] text-[14px] whitespace-nowrap">Button</p>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #ADABAB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full relative shrink-0 w-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
            <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 7" />
          </svg>
        </div>
      </div>
    );
  }
  if (state === "Disable" && icon === "Right" && size === "Samll" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex h-[32px] items-center justify-center relative"} data-name="State=Disable, Icon=Right, Size=Samll, Type=Ghost">
        <div className="content-stretch flex gap-[4px] h-[32px] items-center justify-center py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#adabab] text-[14px] whitespace-nowrap">Button</p>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #ADABAB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Disable" && icon === "Right" && size === "Medium" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Disable, Icon=Right, Size=Medium, Type=Filled">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-center justify-center relative shrink-0">
            <div className="-scale-y-100 flex-none h-full rotate-180">
              <div className="h-full relative w-[8px]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 40">
                  <path d="M0 0L8 20L0 40V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#d6d5d5] content-stretch flex gap-[4px] h-[40px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#adabab] text-[14px] whitespace-nowrap">Button</p>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #ADABAB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center self-stretch">
          <div className="h-full relative shrink-0 w-[8px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 40">
              <path d="M0 0L8 20L0 40V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Disable" && icon === "Right" && size === "Medium" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Disable, Icon=Right, Size=Medium, Type=Ghost">
        <div className="content-stretch flex gap-[4px] h-[40px] items-center justify-center py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#adabab] text-[14px] whitespace-nowrap">Button</p>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #ADABAB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Disable" && icon === "Right" && size === "Large" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Disable, Icon=Right, Size=Large, Type=Filled">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-center justify-center relative shrink-0">
            <div className="-scale-y-100 flex-none h-full rotate-180">
              <div className="h-full relative w-[8px]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 48">
                  <path d="M0 0L8 24L0 48V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#d6d5d5] content-stretch flex gap-[4px] h-[48px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#adabab] text-[14px] whitespace-nowrap">Button</p>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #ADABAB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center self-stretch">
          <div className="h-full relative shrink-0 w-[8px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 48">
              <path d="M0 0L8 24L0 48V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Disable" && icon === "Right" && size === "Large" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Disable, Icon=Right, Size=Large, Type=Ghost">
        <div className="content-stretch flex gap-[4px] h-[48px] items-center justify-center py-[8px] relative shrink-0">
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#adabab] text-[14px] whitespace-nowrap">Button</p>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #ADABAB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Disable" && icon === "Icon Only" && size === "Medium" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex h-[40px] items-center justify-center relative"} data-name="State=Disable, Icon=Icon Only, Size=Medium, Type=Filled">
        <div className="flex h-full items-center justify-center relative shrink-0">
          <div className="-scale-y-100 flex-none h-full rotate-180">
            <div className="h-full relative w-[8px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 40">
                <path d="M0 0L8 20L0 40V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 6" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-[#d6d5d5] content-stretch flex h-[40px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #ADABAB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full relative shrink-0 w-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 40">
            <path d="M0 0L8 20L0 40V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 7" />
          </svg>
        </div>
      </div>
    );
  }
  if (state === "Disable" && icon === "Icon Only" && size === "Medium" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex h-[40px] items-center justify-center relative"} data-name="State=Disable, Icon=Icon Only, Size=Medium, Type=Ghost">
        <div className="content-stretch flex h-[40px] items-center justify-center py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #ADABAB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Default" && icon === "Left" && size === "Samll" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex h-[32px] items-center justify-center relative"} data-name="State=Default, Icon=Left, Size=Samll, Type=Filled">
        <div className="flex h-full items-center justify-center relative shrink-0">
          <div className="-scale-y-100 flex-none h-full rotate-180">
            <div className="h-full relative w-[8px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
                <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #150000)" id="Rectangle 6" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-[#150000] content-stretch flex gap-[4px] h-[32px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[14px] whitespace-nowrap">Button</p>
        </div>
        <div className="h-full relative shrink-0 w-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
            <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #150000)" id="Rectangle 7" />
          </svg>
        </div>
      </div>
    );
  }
  if (state === "Default" && icon === "Left" && size === "Samll" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex h-[32px] items-center justify-center relative"} data-name="State=Default, Icon=Left, Size=Samll, Type=Ghost">
        <div className="content-stretch flex gap-[4px] h-[32px] items-center justify-center py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #150000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#150000] text-[14px] whitespace-nowrap">Button</p>
        </div>
      </div>
    );
  }
  if (state === "Default" && icon === "Left" && size === "Medium" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Default, Icon=Left, Size=Medium, Type=Filled">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-center justify-center relative shrink-0">
            <div className="-scale-y-100 flex-none h-full rotate-180">
              <div className="h-full relative w-[8px]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 40">
                  <path d="M0 0L8 20L0 40V0Z" fill="var(--fill-0, #150000)" id="Rectangle 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#150000] content-stretch flex gap-[4px] h-[40px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[14px] whitespace-nowrap">Button</p>
        </div>
        <div className="flex flex-row items-center self-stretch">
          <div className="h-full relative shrink-0 w-[8px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 40">
              <path d="M0 0L8 20L0 40V0Z" fill="var(--fill-0, #150000)" id="Rectangle 7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Default" && icon === "Left" && size === "Medium" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Default, Icon=Left, Size=Medium, Type=Ghost">
        <div className="content-stretch flex gap-[4px] h-[40px] items-center justify-center py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #150000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#150000] text-[14px] whitespace-nowrap">Button</p>
        </div>
      </div>
    );
  }
  if (state === "Default" && icon === "Left" && size === "Large" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Default, Icon=Left, Size=Large, Type=Filled">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-center justify-center relative shrink-0">
            <div className="-scale-y-100 flex-none h-full rotate-180">
              <div className="h-full relative w-[8px]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 48">
                  <path d="M0 0L8 24L0 48V0Z" fill="var(--fill-0, #150000)" id="Rectangle 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#150000] content-stretch flex gap-[4px] h-[48px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[14px] whitespace-nowrap">Button</p>
        </div>
        <div className="flex flex-row items-center self-stretch">
          <div className="h-full relative shrink-0 w-[8px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 48">
              <path d="M0 0L8 24L0 48V0Z" fill="var(--fill-0, #150000)" id="Rectangle 7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Default" && icon === "Left" && size === "Large" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Default, Icon=Left, Size=Large, Type=Ghost">
        <div className="content-stretch flex gap-[4px] h-[48px] items-center justify-center py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #150000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#150000] text-[14px] whitespace-nowrap">Button</p>
        </div>
      </div>
    );
  }
  if (state === "Default" && icon === "Icon Only" && size === "Large" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex h-[48px] items-center justify-center relative"} data-name="State=Default, Icon=Icon Only, Size=Large, Type=Filled">
        <div className="flex h-full items-center justify-center relative shrink-0">
          <div className="-scale-y-100 flex-none h-full rotate-180">
            <div className="h-full relative w-[8px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 48">
                <path d="M0 0L8 24L0 48V0Z" fill="var(--fill-0, #150000)" id="Rectangle 6" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-[#150000] content-stretch flex h-[48px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full relative shrink-0 w-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 48">
            <path d="M0 0L8 24L0 48V0Z" fill="var(--fill-0, #150000)" id="Rectangle 7" />
          </svg>
        </div>
      </div>
    );
  }
  if (state === "Default" && icon === "Icon Only" && size === "Large" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex h-[48px] items-center justify-center relative"} data-name="State=Default, Icon=Icon Only, Size=Large, Type=Ghost">
        <div className="content-stretch flex h-[48px] items-center justify-center py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #150000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Pressed" && icon === "Left" && size === "Samll" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex h-[32px] items-center justify-center relative"} data-name="State=Pressed, Icon=Left, Size=Samll, Type=Filled">
        <div className="flex h-full items-center justify-center relative shrink-0">
          <div className="-scale-y-100 flex-none h-full rotate-180">
            <div className="h-full relative w-[8px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
                <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #060000)" id="Rectangle 6" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-[#060000] content-stretch flex gap-[4px] h-[32px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[14px] whitespace-nowrap">Button</p>
        </div>
        <div className="h-full relative shrink-0 w-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
            <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #060000)" id="Rectangle 7" />
          </svg>
        </div>
      </div>
    );
  }
  if (state === "Pressed" && icon === "Left" && size === "Samll" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex h-[32px] items-center justify-center relative"} data-name="State=Pressed, Icon=Left, Size=Samll, Type=Ghost">
        <div className="content-stretch flex gap-[4px] h-[32px] items-center justify-center py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #060000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#060000] text-[14px] whitespace-nowrap">Button</p>
        </div>
      </div>
    );
  }
  if (state === "Pressed" && icon === "Left" && size === "Medium" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Pressed, Icon=Left, Size=Medium, Type=Filled">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-center justify-center relative shrink-0">
            <div className="-scale-y-100 flex-none h-full rotate-180">
              <div className="h-full relative w-[8px]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 40">
                  <path d="M0 0L8 20L0 40V0Z" fill="var(--fill-0, #060000)" id="Rectangle 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#060000] content-stretch flex gap-[4px] h-[40px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[14px] whitespace-nowrap">Button</p>
        </div>
        <div className="flex flex-row items-center self-stretch">
          <div className="h-full relative shrink-0 w-[8px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 40">
              <path d="M0 0L8 20L0 40V0Z" fill="var(--fill-0, #060000)" id="Rectangle 7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Pressed" && icon === "Left" && size === "Medium" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Pressed, Icon=Left, Size=Medium, Type=Ghost">
        <div className="content-stretch flex gap-[4px] h-[40px] items-center justify-center py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #060000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#060000] text-[14px] whitespace-nowrap">Button</p>
        </div>
      </div>
    );
  }
  if (state === "Pressed" && icon === "Left" && size === "Large" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Pressed, Icon=Left, Size=Large, Type=Filled">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-center justify-center relative shrink-0">
            <div className="-scale-y-100 flex-none h-full rotate-180">
              <div className="h-full relative w-[8px]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 48">
                  <path d="M0 0L8 24L0 48V0Z" fill="var(--fill-0, #060000)" id="Rectangle 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#060000] content-stretch flex gap-[4px] h-[48px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[14px] whitespace-nowrap">Button</p>
        </div>
        <div className="flex flex-row items-center self-stretch">
          <div className="h-full relative shrink-0 w-[8px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 48">
              <path d="M0 0L8 24L0 48V0Z" fill="var(--fill-0, #060000)" id="Rectangle 7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Pressed" && icon === "Left" && size === "Large" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Pressed, Icon=Left, Size=Large, Type=Ghost">
        <div className="content-stretch flex gap-[4px] h-[48px] items-center justify-center py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #060000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#060000] text-[14px] whitespace-nowrap">Button</p>
        </div>
      </div>
    );
  }
  if (state === "Pressed" && icon === "Icon Only" && size === "Large" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex h-[48px] items-center justify-center relative"} data-name="State=Pressed, Icon=Icon Only, Size=Large, Type=Filled">
        <div className="flex h-full items-center justify-center relative shrink-0">
          <div className="-scale-y-100 flex-none h-full rotate-180">
            <div className="h-full relative w-[8px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 48">
                <path d="M0 0L8 24L0 48V0Z" fill="var(--fill-0, #060000)" id="Rectangle 6" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-[#060000] content-stretch flex h-[48px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full relative shrink-0 w-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 48">
            <path d="M0 0L8 24L0 48V0Z" fill="var(--fill-0, #060000)" id="Rectangle 7" />
          </svg>
        </div>
      </div>
    );
  }
  if (state === "Pressed" && icon === "Icon Only" && size === "Large" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex h-[48px] items-center justify-center relative"} data-name="State=Pressed, Icon=Icon Only, Size=Large, Type=Ghost">
        <div className="content-stretch flex h-[48px] items-center justify-center py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <path d={svgPaths.p3da40210} id="Vector" stroke="var(--stroke-0, #060000)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Disable" && icon === "Left" && size === "Samll" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex h-[32px] items-center justify-center relative"} data-name="State=Disable, Icon=Left, Size=Samll, Type=Filled">
        <div className="flex h-full items-center justify-center relative shrink-0">
          <div className="-scale-y-100 flex-none h-full rotate-180">
            <div className="h-full relative w-[8px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
                <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 6" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-[#d6d5d5] content-stretch flex gap-[4px] h-[32px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <g id="Vector">
                    <path d={svgPaths.p648caf0} fill="var(--fill-0, #ADABAB)" />
                    <path d={svgPaths.p3da40210} stroke="var(--stroke-0, #ADABAB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#adabab] text-[14px] whitespace-nowrap">Button</p>
        </div>
        <div className="h-full relative shrink-0 w-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
            <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 7" />
          </svg>
        </div>
      </div>
    );
  }
  if (state === "Disable" && icon === "Left" && size === "Samll" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex h-[32px] items-center justify-center relative"} data-name="State=Disable, Icon=Left, Size=Samll, Type=Ghost">
        <div className="content-stretch flex gap-[4px] h-[32px] items-center justify-center py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <g id="Vector">
                    <path d={svgPaths.p648caf0} fill="var(--fill-0, #ADABAB)" />
                    <path d={svgPaths.p3da40210} stroke="var(--stroke-0, #ADABAB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#adabab] text-[14px] whitespace-nowrap">Button</p>
        </div>
      </div>
    );
  }
  if (state === "Disable" && icon === "Left" && size === "Medium" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Disable, Icon=Left, Size=Medium, Type=Filled">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-center justify-center relative shrink-0">
            <div className="-scale-y-100 flex-none h-full rotate-180">
              <div className="h-full relative w-[8px]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 40">
                  <path d="M0 0L8 20L0 40V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#d6d5d5] content-stretch flex gap-[4px] h-[40px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <g id="Vector">
                    <path d={svgPaths.p648caf0} fill="var(--fill-0, #ADABAB)" />
                    <path d={svgPaths.p3da40210} stroke="var(--stroke-0, #ADABAB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#adabab] text-[14px] whitespace-nowrap">Button</p>
        </div>
        <div className="flex flex-row items-center self-stretch">
          <div className="h-full relative shrink-0 w-[8px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 40">
              <path d="M0 0L8 20L0 40V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Disable" && icon === "Left" && size === "Medium" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Disable, Icon=Left, Size=Medium, Type=Ghost">
        <div className="content-stretch flex gap-[4px] h-[40px] items-center justify-center py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <g id="Vector">
                    <path d={svgPaths.p648caf0} fill="var(--fill-0, #ADABAB)" />
                    <path d={svgPaths.p3da40210} stroke="var(--stroke-0, #ADABAB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#adabab] text-[14px] whitespace-nowrap">Button</p>
        </div>
      </div>
    );
  }
  if (state === "Disable" && icon === "Left" && size === "Large" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Disable, Icon=Left, Size=Large, Type=Filled">
        <div className="flex flex-row items-center self-stretch">
          <div className="flex h-full items-center justify-center relative shrink-0">
            <div className="-scale-y-100 flex-none h-full rotate-180">
              <div className="h-full relative w-[8px]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 48">
                  <path d="M0 0L8 24L0 48V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#d6d5d5] content-stretch flex gap-[4px] h-[48px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <g id="Vector">
                    <path d={svgPaths.p648caf0} fill="var(--fill-0, #ADABAB)" />
                    <path d={svgPaths.p3da40210} stroke="var(--stroke-0, #ADABAB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#adabab] text-[14px] whitespace-nowrap">Button</p>
        </div>
        <div className="flex flex-row items-center self-stretch">
          <div className="h-full relative shrink-0 w-[8px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 48">
              <path d="M0 0L8 24L0 48V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  if (state === "Disable" && icon === "Left" && size === "Large" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex items-center justify-center relative"} data-name="State=Disable, Icon=Left, Size=Large, Type=Ghost">
        <div className="content-stretch flex gap-[4px] h-[48px] items-center justify-center py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <g id="Vector">
                    <path d={svgPaths.p648caf0} fill="var(--fill-0, #ADABAB)" />
                    <path d={svgPaths.p3da40210} stroke="var(--stroke-0, #ADABAB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#adabab] text-[14px] whitespace-nowrap">Button</p>
        </div>
      </div>
    );
  }
  if (state === "Disable" && icon === "Icon Only" && size === "Large" && type === "Filled") {
    return (
      <div className={className || "content-stretch flex h-[48px] items-center justify-center relative"} data-name="State=Disable, Icon=Icon Only, Size=Large, Type=Filled">
        <div className="flex h-full items-center justify-center relative shrink-0">
          <div className="-scale-y-100 flex-none h-full rotate-180">
            <div className="h-full relative w-[8px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 48">
                <path d="M0 0L8 24L0 48V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 6" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-[#d6d5d5] content-stretch flex h-[48px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <g id="Vector">
                    <path d={svgPaths.p648caf0} fill="var(--fill-0, #ADABAB)" />
                    <path d={svgPaths.p3da40210} stroke="var(--stroke-0, #ADABAB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full relative shrink-0 w-[8px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 48">
            <path d="M0 0L8 24L0 48V0Z" fill="var(--fill-0, #D6D5D5)" id="Rectangle 7" />
          </svg>
        </div>
      </div>
    );
  }
  if (state === "Disable" && icon === "Icon Only" && size === "Large" && type === "Ghost") {
    return (
      <div className={className || "content-stretch flex h-[48px] items-center justify-center relative"} data-name="State=Disable, Icon=Icon Only, Size=Large, Type=Ghost">
        <div className="content-stretch flex h-[48px] items-center justify-center py-[8px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Button/State10">
            <div className="absolute inset-[21.88%]" data-name="Vector">
              <div className="absolute inset-[-8.33%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
                  <g id="Vector">
                    <path d={svgPaths.p648caf0} fill="var(--fill-0, #ADABAB)" />
                    <path d={svgPaths.p3da40210} stroke="var(--stroke-0, #ADABAB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={className || "content-stretch flex h-[32px] items-center justify-center relative"} data-name="State=Default, Icon=None, Size=Samll, Type=Filled">
      <div className="flex h-full items-center justify-center relative shrink-0">
        <div className="-scale-y-100 flex-none h-full rotate-180">
          <div className="h-full relative w-[8px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
              <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #150000)" id="Rectangle 6" />
            </svg>
          </div>
        </div>
      </div>
      <div className="bg-[#150000] content-stretch flex h-[32px] items-center justify-center px-[16px] py-[8px] relative shrink-0">
        <p className="[word-break:break-word] font-['Bebas_Neue:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[14px] whitespace-nowrap">Button</p>
      </div>
      <div className="h-full relative shrink-0 w-[8px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 32">
          <path d="M0 0L8 16L0 32V0Z" fill="var(--fill-0, #150000)" id="Rectangle 7" />
        </svg>
      </div>
    </div>
  );
}