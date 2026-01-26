import './index.scss';

interface IProps {
    title: string;
    onClick: () => void;
}

export const MCButton = ({title, onClick}: IProps) => {
    return (
        <div className="mc-button full" onClick={onClick}>
            <div className="title">{title}</div>
        </div>
    )
}