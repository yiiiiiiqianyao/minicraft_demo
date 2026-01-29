import './transition.scss';
import './index.scss';
import { useRef, type CSSProperties, type FC, type PropsWithChildren, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import type { CSSTransitionClassNames } from 'react-transition-group/CSSTransition';
import { useLockScroll } from './utils';

export interface IBasePopupProps {
  show: boolean;
  /**
   * 弹窗开启时是否锁定滚动避免滚动穿透
   *
   * 传节点的 ref 对象可以指定锁定滚动的节点，默认锁定 `document.body`
   */
  lockScroll?: RefObject<HTMLElement> | boolean;
  className?: string;
  style?: CSSProperties;
  overlayStyle?: CSSProperties;
  onClose?: () => void;
  onClosed?: () => void;
  onEntered?: () => void;
  children?: React.ReactNode;
  customAnimation?: CSSTransitionClassNames;
  animationDuration?: number;
  /** 蒙层是否支持交互 - 点击关闭弹窗 */
  maskInteraction?: boolean;
}

export interface IPopupProps extends IBasePopupProps {
  position?: 'bottom' | 'left' | 'right' | 'center';
}

export interface ITopPopupProps extends IBasePopupProps {
  position: 'top';
  marginTop?: number;
}

const Popup: FC<IPopupProps | ITopPopupProps> = (props) => {
  const {
    position = 'center',
    lockScroll = false,
    children,
    show,
    onClose,
    onClosed,
    onEntered,
    className = '',
    style,
    overlayStyle,
    customAnimation = {},
    animationDuration = 300,
    maskInteraction = true, // 蒙层点击交互 - 关闭弹窗
    ...rest
  } = props as PropsWithChildren<IPopupProps | ITopPopupProps>;
  const { marginTop = 0 } = props as ITopPopupProps;
  const isTop = position === 'top';

  const maskRef = useRef(null); // 创建ref
  const popupRef = useRef(null); // 创建ref

  const lockScrollToggle = Boolean(lockScroll);
  const lockScrollTarget =
    typeof lockScroll === 'boolean' ? undefined /** use default target `document.body` */ : lockScroll;

  useLockScroll(lockScrollTarget, show && lockScrollToggle);

  return createPortal(
    <>
      <CSSTransition 
        in={show} 
        nodeRef={maskRef}
        timeout={animationDuration} 
        classNames="overlay-fade" mountOnEnter unmountOnExit>
        {/* 点击蒙层关闭 */}
        <div
          className="overlay"
          ref={maskRef}
          style={{
            top: isTop ? marginTop : undefined,
            height: isTop ? `calc(100vh - ${marginTop}px)` : '100vh',
            ...overlayStyle,
          }}
          onClick={() => maskInteraction && onClose && onClose()}
          {...rest}
        />
      </CSSTransition>

      <CSSTransition
        in={show}
        timeout={animationDuration}
        nodeRef={popupRef}
        classNames={{
          appear: `popup-${position === 'center' ? 'fade' : 'slide'}-${position}-appear`,
          appearActive: `popup-${position === 'center' ? 'fade' : 'slide'}-${position}-appear-active`,
          appearDone: `popup-${position === 'center' ? 'fade' : 'slide'}-${position}-appear-done`,
          enter: `popup-${position === 'center' ? 'fade' : 'slide'}-${position}-enter`,
          enterActive: `popup-${position === 'center' ? 'fade' : 'slide'}-${position}-enter-active`,
          enterDone: `popup-${position === 'center' ? 'fade' : 'slide'}-${position}-enter-done`,
          exit: `popup-${position === 'center' ? 'fade' : 'slide'}-${position}-exit`,
          exitActive: `popup-${position === 'center' ? 'fade' : 'slide'}-${position}-exit-active`,
          exitDone: `popup-${position === 'center' ? 'fade' : 'slide'}-${position}-exit-done`,
          ...customAnimation,
        }}
        mountOnEnter
        unmountOnExit={position === 'center'}
        onEntered={onEntered}
        onExited={onClosed}
      >
        <div
          ref={popupRef}
          className={`popup popup--${position} ${className}`}
          style={{ ...style, top: isTop ? `${marginTop}px` : undefined }}
        >
          {children}
        </div>
      </CSSTransition>
    </>,
    document.body,
  );
};

export default Popup;
