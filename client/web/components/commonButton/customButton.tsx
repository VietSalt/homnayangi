import React from 'react';
import style from './style.module.scss';
interface ButtonProps {
    children: string;
}
const CustomButton = (props: ButtonProps) => {
    return <div className={style.customButton}>{props.children}</div>;
};

export default CustomButton;
