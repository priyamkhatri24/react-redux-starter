import React, { useEffect } from 'react';

const QuestionCard = (props) => {
  const { currentQuestion } = props;
  useEffect(() => {
    console.log(currentQuestion);
  }, []);

  return <div>ljfsflk</div>;
};

export default QuestionCard;
