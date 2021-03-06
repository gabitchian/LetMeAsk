/* eslint-disable react/button-has-type */
/* eslint-disable react/react-in-jsx-scope */
import React, { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';

import useAuth from '../hooks/useAuth';

import Button from '../components/Button';
import RoomCode from '../components/RoomCode';

import '../styles/room.scss';
import { database } from '../services/firebase';

type FirebaseQuestions = Record<string, {
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    author: {
        name: string;
        avatar: string;
    }
}>;

type Question = {
    id: string;
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    author: {
        name: string;
        avatar: string;
    }
};

type RoomParams = {
    id: string;
}

export default () => {
  const { user, signInWithGoogle } = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', (room) => {
      const databaseRoom = room.val();
      const firebaseQuestion: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestion)
        .map(([key, value]) => ({
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
        }));

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });
  }, [roomId]);

  const handleSendQuestion = async (event: FormEvent) => {
    event.preventDefault();
    if (newQuestion.trim() === '') return;

    if (!user) {
      throw new Error('You must be logged in!');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion('');
  };

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Let me ask!" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>
            Sala
            {' '}
            {title}
          </h1>
          { questions.length > 0 && (
          <span>
            {questions.length}
            {' '}
            pergunta(s)
          </span>
          )}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que voc?? quer perguntar?"
            onChange={({ target }) => setNewQuestion(target.value)}
            value={newQuestion}
          />
          <div className="form-footer">
            { user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta,
                {' '}
                <button onClick={() => signInWithGoogle()}>fa??a seu login</button>
              </span>
            ) }
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>

        {JSON.stringify(questions)}
      </main>
    </div>
  );
};
