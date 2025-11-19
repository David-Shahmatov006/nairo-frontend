import { TbLoader2 } from "react-icons/tb"

export const Loader = () => {
    return (
        <div className="flex items-center justify-center z-[999] fixed inset-0 size-full backdrop-blur-[7px]">
            <TbLoader2 className="animate-spin text-[#8b53ff] text-[80px]" />
        </div>
    )
}