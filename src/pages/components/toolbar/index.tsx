import './index.scss';

const ToolBarBg = 'https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/gui/toolbar.png';
const ToolBarActive = 'https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/gui/toolbar_active.png';
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