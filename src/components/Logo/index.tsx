import logo from '../../../public/nairo_logo.webp'

export const Logo = () => {
    return (
        <div className='flex items-center gap-2 hover:opacity-70 duration-300 cursor-pointer'>
            <img src={logo} className='w-[40px]' />
            <span className='font-manrope font-[700] text-[30px]'>Nairo</span>
        </div>
    )
}