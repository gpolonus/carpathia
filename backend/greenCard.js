// package websocket.gamesocket;

// import java.util.List;
// import java.util.ArrayList;
// import java.util.Random;

import greenCards from './greenCards.json' with { type: "json" };

let greenCardHolder = greenCards

export default {
  getCard: () => {
    const cardIndex = Math.round(Math.random() * (greenCards.length - 1))
    const card = { ...greenCardHolder.splice(cardIndex, 1)[0] };
    if (greenCardHolder.length === 0) {
      greenCardHolder = greenCards
    }
    // const randomMapping = randomizeNumbers(card.options.length);
    // card.options = card.options.map((_, i) => card.options[randomMapping[i]]);
    // card.answer = randomMapping[card.answer];
    card.answerValue = card.options[card.answer - 1];
    card.options = randomizeItems(card.options)
    return card;
  }
}

const randomizeItems = items => {
  // const randomizeArray = (values, ac = []) => {
  //   if(values.length === 0) return ac;
  //   const randIndex = Math.round(Math.random() * (values.length - 1));
  //   const [value] = values.splice(randIndex, 1);
  //   return randomizeArray(values, [...ac, value]);
  // };

  // return randomizeArray(items);
  const nums = [...items]
  return items.map(i => nums.splice(Math.round(Math.random() * (nums.length - 1)), 1)[0])
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