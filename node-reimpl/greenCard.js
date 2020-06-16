// package websocket.gamesocket;

// import java.util.List;
// import java.util.ArrayList;
// import java.util.Random;

const greenCards = require('./greenCards.json');

module.exports = {
  getCard: () => {
    const card = { ...greenCards[Math.round(Math.random() * (greenCards.length - 1))] };
    const randomMapping = randomizeNumbers(card.options.length);
    card.options = card.options.map((_, i) => card.options[randomMapping[i]]);
    card.answer = randomMapping[card.answer];
    card.answerValue = card.options[card.answer];
    return card;
  }
}

const randomizeNumbers = num => {
  const array = Array(num).fill().map((_, i) => i);
  const randomizeArray = (values, ac = []) => {
    if(values.length === 0) return ac;
    const randIndex = Math.round(Math.random() * (values.length - 1));
    const [value] = values.splice(randIndex, 1);
    return randomizeArray(values, [...ac, value]);
  };

  return randomizeArray(array);
}

// public class GreenCard
// {
//   public String question;
//   public List<String> answers;
//   public int answer;
//   public int tempAnswer;
//   public int randomSequences[][];

//   public GreenCard(String q, List<String> as, int a)
//   {
//     question = q;
//     answers = as;
//     answer = a;
//     randomSequences = new int[][] {{1,2,3,4},{1,2,4,3},{1,3,2,4},{1,3,4,2},{1,4,3,2},{1,4,2,3},{2,1,3,4},{2,1,4,3},{2,3,1,4},{2,3,4,1},{2,4,3,1},{2,4,1,3},{3,2,1,4},{3,2,4,1},{3,1,2,4},{3,1,4,2},{3,4,2,1},{3,4,1,2},{4,2,3,1},{4,2,1,3},{4,1,3,2},{4,1,2,3},{4,3,1,2},{4,3,2,1}};
//   }

//   public boolean correct(String an)
//   {
//     return an.equals(""+answer);
//   }

//   public String[] getRandomAnswers()
//   {
//     int[] order = randomSequences[(new Random()).nextInt(24)];
//     for(int i = 0; i < 4; i++)
//       if(order[i] == answer)
//         tempAnswer = i;
//     return new String[] {answers.get((int)order[0]-1), answers.get((int)order[1]-1), answers.get((int)order[2]-1), answers.get((int)order[3]-1)};
//   }

//   public boolean getRandomedAnswer(String an)
//   {
//     return an.equals("" + (tempAnswer+1));
//   }
// }