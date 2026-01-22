import './index.scss';
import LogoImg from '@/assets/gui/logo.png'

/**@desc 首页面展示的 logo */
export const Logo = () => {
    return <img id="logo" className='poster_logo' src={LogoImg} />
}