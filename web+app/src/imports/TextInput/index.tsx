function TitleType() {
  return (
    <div className="content-stretch flex font-['IBM_Plex_Sans:Light',sans-serif] font-light gap-[16px] items-center justify-center leading-[64px] relative shrink-0 text-[54px]" data-name="Title + Type">
      <p className="relative shrink-0 text-[#161616]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Text input
      </p>
      <p className="relative shrink-0 text-[#525252]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Final
      </p>
    </div>
  );
}

function SourceTitleType() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col items-start relative shrink-0 whitespace-nowrap" data-name="Source + Title + Type">
      <p className="font-['IBM_Plex_Sans:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[#0f62fe] text-[16px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Carbon Design System
      </p>
      <TitleType />
    </div>
  );
}

function Content() {
  return <div className="bg-white h-[1334px] mix-blend-multiply relative shrink-0 w-[1256px]" data-name="Content" />;
}

export default function TextInput() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="Text input">
      <div className="relative shrink-0 w-full" data-name="Artboard header | IBM documentation library">
        <div aria-hidden className="absolute bg-white inset-0 pointer-events-none" />
        <div className="content-stretch flex flex-col gap-[16px] items-start pb-[48px] pt-[96px] px-[96px] relative size-full">
          <SourceTitleType />
        </div>
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_#c6c6c6]" />
      </div>
      <Content />
    </div>
  );
}