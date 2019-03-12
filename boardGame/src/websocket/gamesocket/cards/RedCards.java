package websocket.gamesocket.cards;

import java.util.List;
import java.util.ArrayList;
import java.util.Random;

public class RedCards
{
	public List<RedCard> cards;

	public RedCard getCard()
	{
		return cards.get((new Random()).nextInt(cards.size()));
	}

	public RedCards()
	{
		cards = new ArrayList<RedCard>();

		cards.add(new RedCard("Tell about a time where you told people to tell a story or asked them an ambiguous question."));

		cards.add(new RedCard("Would you kill to eat?"));

		cards.add(new RedCard("DROP TABLE;"));

		cards.add(new RedCard("Tell about a time you saw David Bromberg live."));

		cards.add(new RedCard("Tell me about the time you had an ethics complex with your coworkers? Use lots of unnecessary language and be as confusing as possible."));

		cards.add(new RedCard("If you were to run for your local school board, why would you not get elected?"));

		cards.add(new RedCard("What was the worst Christmas you ever had?"));

		cards.add(new RedCard("How many times have you eaten?"));

		cards.add(new RedCard("How did you cause the apocolypse?"));

		cards.add(new RedCard("How many molecules are on Leonard Nimoy\'s butt?"));

		cards.add(new RedCard("What was the last thing you said to a dog?"));

		cards.add(new RedCard("Tell about a time you got in trouble."));

		cards.add(new RedCard("When did you eat the most?"));

		cards.add(new RedCard("Tell about a time you climbed onto the roof of a building on the Bradley campus."));

		cards.add(new RedCard("When is a time you lied to get out of a sticky situation?"));

		cards.add(new RedCard("How did your parents meet?"));

		cards.add(new RedCard("Tell about a time you had to make a split second decision."));

		cards.add(new RedCard("When was the first time you drove a car?"));

		cards.add(new RedCard("Tell about a time your friends surprised you."));

		cards.add(new RedCard("Describe breakfast you ate within the last week."));

		cards.add(new RedCard("Tell about a time you were irrationally happy."));

		cards.add(new RedCard("Talk about a time you were in the psyche ward."));

		cards.add(new RedCard("When were you at the highest altitude?"));

		cards.add(new RedCard("What's the loudest noise you've ever heard?"));

		cards.add(new RedCard("How did you fall out of love with Aaron Roos? Doesn't matter if you know him or not. Just answer the question."));

		cards.add(new RedCard("How many cartons of milk can you drink?"));

		cards.add(new RedCard("How gay are you?"));


	}

}