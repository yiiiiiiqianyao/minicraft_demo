import './index.scss';
import ToolBarBg from '@/assets/gui/toolbar.png'
import ToolBarActive from '@/assets/gui/toolbar_active.png'

/**
 * @desc 工具栏 UI 组件
 */
export const ToolBar = () => {
    return <div id="toolbar">
        <img id="toolbar-bg" src={ToolBarBg} />
        <img id="toolbar-active-border" src={ToolBarActive} />
        <div className="toolbar-slot" id="toolbar-slot-1"></div>
        <div className="toolbar-slot" id="toolbar-slot-2"></div>
        <div className="toolbar-slot" id="toolbar-slot-3"></div>
        <div className="toolbar-slot" id="toolbar-slot-4"></div>
        <div className="toolbar-slot" id="toolbar-slot-5"></div>
        <div className="toolbar-slot" id="toolbar-slot-6"></div>
        <div className="toolbar-slot" id="toolbar-slot-7"></div>
        <div className="toolbar-slot" id="toolbar-slot-8"></div>
        <div className="toolbar-slot" id="toolbar-slot-9"></div>
    </div>
}