package websocket.gamesocket;

import java.util.List;
import java.util.LinkedList;
import java.util.Random;

public class RedCards
{
	public List<RedCard> cards;
	public LinkedList<RedCard> cardsHolder;

	public RedCard getCard()
	{
		RedCard temp = cards.remove((new Random()).nextInt(cards.size()));
		if(cards.size() == 0)
			cards = (List)cardsHolder.clone();
		return temp;
	}

	public RedCards()
	{
		cards = new LinkedList<RedCard>();
		cardsHolder = new LinkedList<RedCard>();

		cards.add(new RedCard("Tell about a time where you told people to tell a story or asked them an ambiguous question."));
		cardsHolder.add(new RedCard("Tell about a time where you told people to tell a story or asked them an ambiguous question."));
		cards.add(new RedCard("Would you kill to eat?"));
		cardsHolder.add(new RedCard("Would you kill to eat?"));
		cards.add(new RedCard("DROP TABLE;"));
		cardsHolder.add(new RedCard("DROP TABLE;"));
		cards.add(new RedCard("Tell about a time you saw David Bromberg live."));
		cardsHolder.add(new RedCard("Tell about a time you saw David Bromberg live."));
		cards.add(new RedCard("Tell me about the time you had an ethics complex with your coworkers? Use lots of unnecessary language and be as confusing as possible."));
		cardsHolder.add(new RedCard("Tell me about the time you had an ethics complex with your coworkers? Use lots of unnecessary language and be as confusing as possible."));
		cards.add(new RedCard("If you were to run for your local school board, why would you not get elected?"));
		cardsHolder.add(new RedCard("If you were to run for your local school board, why would you not get elected?"));
		cards.add(new RedCard("What was the worst Christmas you ever had?"));
		cardsHolder.add(new RedCard("What was the worst Christmas you ever had?"));
		cards.add(new RedCard("How many times have you eaten?"));
		cardsHolder.add(new RedCard("How many times have you eaten?"));
		cards.add(new RedCard("How did you cause the apocolypse?"));
		cardsHolder.add(new RedCard("How did you cause the apocolypse?"));
		cards.add(new RedCard("How many molecules are on Leonard Nimoy\'s butt?"));
		cardsHolder.add(new RedCard("How many molecules are on Leonard Nimoy\'s butt?"));
		cards.add(new RedCard("What was the last thing you said to a dog?"));
		cardsHolder.add(new RedCard("What was the last thing you said to a dog?"));
		cards.add(new RedCard("Tell about a time you got in trouble."));
		cardsHolder.add(new RedCard("Tell about a time you got in trouble."));
		cards.add(new RedCard("When did you eat the most?"));
		cardsHolder.add(new RedCard("When did you eat the most?"));
		cards.add(new RedCard("Tell about a time you climbed onto the roof of a building on the Bradley campus."));
		cardsHolder.add(new RedCard("Tell about a time you climbed onto the roof of a building on the Bradley campus."));
		cards.add(new RedCard("When is a time you lied to get out of a sticky situation?"));
		cardsHolder.add(new RedCard("When is a time you lied to get out of a sticky situation?"));
		cards.add(new RedCard("How did your parents meet?"));
		cardsHolder.add(new RedCard("How did your parents meet?"));
		cards.add(new RedCard("Tell about a time you had to make a split second decision."));
		cardsHolder.add(new RedCard("Tell about a time you had to make a split second decision."));
		cards.add(new RedCard("When was the first time you drove a car?"));
		cardsHolder.add(new RedCard("When was the first time you drove a car?"));
		cards.add(new RedCard("Tell about a time your friends surprised you."));
		cardsHolder.add(new RedCard("Tell about a time your friends surprised you."));
		cards.add(new RedCard("Describe breakfast you ate within the last week."));
		cardsHolder.add(new RedCard("Describe breakfast you ate within the last week."));
		cards.add(new RedCard("Tell about a time you were irrationally happy."));
		cardsHolder.add(new RedCard("Tell about a time you were irrationally happy."));
		cards.add(new RedCard("Talk about a time you were in the psyche ward."));
		cardsHolder.add(new RedCard("Talk about a time you were in the psyche ward."));
		cards.add(new RedCard("When were you at the highest altitude?"));
		cardsHolder.add(new RedCard("When were you at the highest altitude?"));
		cards.add(new RedCard("What's the loudest noise you've ever heard?"));
		cardsHolder.add(new RedCard("What's the loudest noise you've ever heard?"));
		cards.add(new RedCard("How did you fall out of love with Aaron Roos? Doesn't matter if you know him or not. Just answer the question."));
		cardsHolder.add(new RedCard("How did you fall out of love with Aaron Roos? Doesn't matter if you know him or not. Just answer the question."));
		cards.add(new RedCard("How many cartons of milk can you drink?"));
		cardsHolder.add(new RedCard("How many cartons of milk can you drink?"));
		cards.add(new RedCard("How gay are you?"));
		cards.add(new RedCard("How gay are you?"));
		cardsHolder.add(new RedCard("How gay are you?"));

		cards.add(new RedCard("Are you high yet?"));
		cardsHolder.add(new RedCard("Are you high yet?"));

		cards.add(new RedCard("Do you like miniwheats?"));
		cardsHolder.add(new RedCard("Do you like miniwheats?"));

		cards.add(new RedCard("What is so weird?"));
		cardsHolder.add(new RedCard("What is so weird?"));

		cards.add(new RedCard("Do you like doggos?"));
		cardsHolder.add(new RedCard("Do you like doggos?"));

		cards.add(new RedCard("What is so great?"));
		cardsHolder.add(new RedCard("What is so great?"));

		cards.add(new RedCard("What is blowing your mind right now?"));
		cardsHolder.add(new RedCard("What is blowing your mind right now?"));

		cards.add(new RedCard("Thank the person on your right for something. How did they react? Were you sincere?"));
		cardsHolder.add(new RedCard("Thank the person on your right for something. How did they react? Were you sincere?"));

		cards.add(new RedCard("When did you cut ties to all the lies that you've been living in?"));
		cardsHolder.add(new RedCard("When did you cut ties to all the lies that you've been living in?"));

		cards.add(new RedCard("Do you stick your tongue in bottles?"));
		cardsHolder.add(new RedCard("Do you stick your tongue in bottles?"));

		cards.add(new RedCard("WHY ARE YOU SITTING DOWN?"));
		cardsHolder.add(new RedCard("WHY ARE YOU SITTING DOWN?"));

		cards.add(new RedCard("Do trees make noise?"));
		cardsHolder.add(new RedCard("Do trees make noise?"));

		cards.add(new RedCard("What is your favorite board game?"));
		cardsHolder.add(new RedCard("What is your favorite board game?"));

		cards.add(new RedCard("How scenic is the most scenic beer?"));
		cardsHolder.add(new RedCard("How scenic is the most scenic beer?"));


	}

}