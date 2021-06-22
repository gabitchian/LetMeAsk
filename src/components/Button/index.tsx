/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/button-has-type */
import React, { ButtonHTMLAttributes } from 'react';
import './index.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default (props: ButtonProps) => (
  <button className="button" {...props} />
);
