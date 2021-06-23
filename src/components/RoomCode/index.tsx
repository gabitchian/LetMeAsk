/* eslint-disable react/button-has-type */
import React from 'react';
import copyImg from '../../assets/images/copy.svg';
import './index.scss';

type RoomCodeProps = {
    code: string;
};

export default ({ code }: RoomCodeProps) => {
  const copyRoomCodeToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <button className="room-code" onClick={copyRoomCodeToClipboard}>
      <div>
        <img src={copyImg} alt="Copiar código da sala" />
      </div>
      <span>
        Sala #
        {code}
      </span>
    </button>
  );
};
