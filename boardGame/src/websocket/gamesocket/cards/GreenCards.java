package websocket.gamesocket.cards;

import java.util.List;
import java.util.ArrayList;
import java.util.Random;

public class GreenCards
{
	public List<GreenCard> cards;

	public GreenCard getCard()
	{
		return cards.get((new Random()).nextInt(cards.size()));
	}

	public GreenCards()
	{
		cards = new ArrayList<GreenCard>();
		List<String> options;

		options = new ArrayList<String>();
			options.add("Because he did not want people to look at the code and know the answers.");
			options.add("Because he did not want to force Java to mess around with MySQL databases.");
			options.add("Because he knows how to do that.");
			options.add("A combination of all the other answers.");
			cards.add(new GreenCard("Why did the creator of this store card information by writing to a Java file?", options, 4));

		options = new ArrayList<String>();
			options.add("I grew up.");
			options.add("I got hit in the head with a bat.");
			options.add("Times change man.");
			options.add("Literally anything.");
			cards.add(new GreenCard("What happened?", options, 4));

		options = new ArrayList<String>();
			options.add("Sandy");
			options.add("Winter");
			options.add("Sammy");
			options.add("Summer");
			cards.add(new GreenCard("What is Morty Smith's sister's name?", options, 4));

		options = new ArrayList<String>();
			options.add("Clorofill");
			options.add("Chlorofyll");
			options.add("Choropill");
			options.add("Chlorophyll");
			cards.add(new GreenCard("What makes leaves green?", options, 4));

		options = new ArrayList<String>();
			options.add("Yes");
			options.add("No");
			options.add("Myabe");
			options.add("Can\'t see");
			cards.add(new GreenCard("Butts?", options, 1));

		options = new ArrayList<String>();
			options.add("Alderaan");
			options.add("Hoth");
			options.add("Mars");
			options.add("Your mom\'s place");
			cards.add(new GreenCard("Where is the rebel base?", options, 2));

		options = new ArrayList<String>();
			options.add("69");
			options.add("42");
			options.add("53");
			options.add("Is this a Bob Dylan reference?");
			cards.add(new GreenCard("How many roads must a man walk down?", options, 2));

		options = new ArrayList<String>();
			options.add("Fuck off.");
			options.add("3");
			options.add("4");
			options.add("32");
			cards.add(new GreenCard("How many sidewalks must a man walk down?", options, 3));

		options = new ArrayList<String>();
			options.add("Blue");
			options.add("Green");
			options.add("Yellow");
			options.add("Red");
			cards.add(new GreenCard("What color is absinthe?", options, 2));

		options = new ArrayList<String>();
			options.add("Benjamin Franklin");
			options.add("Isaac Newton");
			options.add("Thomas Edison");
			options.add("John Newton");
			cards.add(new GreenCard("Who averaged a patent for every three weeks of his life?", options, 3));

		options = new ArrayList<String>();
			options.add("4.5%");
			options.add("6.3%");
			options.add("4.2%");
			options.add("5.6%");
			cards.add(new GreenCard("What is the alcohol per volume of Sierra Nevada Pale Ale?", options, 4));

		options = new ArrayList<String>();
			options.add("6");
			options.add("9");
			options.add("10");
			options.add("As many beers it takes to get Griffin drunk.");
			cards.add(new GreenCard("How many beers does it take to get Griffin drunk?", options, 4));

		options = new ArrayList<String>();
			options.add("Enough");
			options.add("Eight menora candles");
			options.add("Qwelve");
			options.add("6");
			cards.add(new GreenCard("How many Christmas?", options, 1));

		options = new ArrayList<String>();
			options.add("How?");
			options.add("Yes.");
			options.add("Because.");
			options.add("It\'ll be fun!");
			cards.add(new GreenCard("Why?", options, 3));

		options = new ArrayList<String>();
			options.add("Protein");
			options.add("Protein");
			options.add("Protein");
			options.add("Protein");
			cards.add(new GreenCard("How do you spell protein?", options, 1));

		options = new ArrayList<String>();
			options.add("White");
			options.add("Indeterminate");
			options.add("Green");
			options.add("Fart");
			cards.add(new GreenCard("What color is my shirt?", options, 2));

		options = new ArrayList<String>();
			options.add("Andrew Johnson");
			options.add("Andrew Jackson");
			options.add("Franklin Pierce");
			options.add("Benjamin Harrison");
			cards.add(new GreenCard("Who was the 17th president?", options, 1));

		options = new ArrayList<String>();
			options.add("That's not what your mom said...");
			options.add("Oh! The uniform!");
			options.add("She's rich! Rich, powerful...");
			options.add("Bitch please I'm the second black character in the star wars universe");
			cards.add(new GreenCard("Aren't you a little short for a storm trooper?", options, 4));

		options = new ArrayList<String>();
			options.add("If you cut it down, then  youll surely know.");
			options.add("If you cut it down, then they will come.");
			options.add("If you cut it down, you better starting runnin boy!");
			options.add("If you cut it down, then youll never know.");
			cards.add(new GreenCard("How high does a Sycamore grow?", options, 4));

		options = new ArrayList<String>();
			options.add("Gerald Ford");
			options.add("Spencer Silver");
			options.add("Paul Krugman");
			options.add("Arthur Fry");
			cards.add(new GreenCard("Who invented sticky notes?", options, 4));

		options = new ArrayList<String>();
			options.add("December");
			options.add("March");
			options.add("September");
			options.add("June");
			cards.add(new GreenCard("In what month did ancient Romans celebrate Saturnalia?", options, 1));

		options = new ArrayList<String>();
			options.add("Carbon dioxide");
			options.add("Water vapor");
			options.add("Nitrogen");
			options.add("Methane");
			cards.add(new GreenCard("On average, what is the most abundant gas released into the atmospher by volcanoes?", options, 2));

		options = new ArrayList<String>();
			options.add("Frank Oz");
			options.add("Tom Kane");
			options.add("Gilbert Gottfried");
			options.add("Nancy Cartwright");
			cards.add(new GreenCard("Who voiced Miss Piggy?", options, 1));

		options = new ArrayList<String>();
			options.add("He");
			options.add("She");
			options.add("It");
			options.add("They");
			cards.add(new GreenCard("Who got so much things to say right now?", options, 4));

		options = new ArrayList<String>();
			options.add("Zhang Qun");
			options.add("Ma Ying-jeou ");
			options.add("Xi Jinping");
			options.add("Lin Bih-jaw");
			cards.add(new GreenCard("As of October 2016, who is the president of China? ", options, 3));

		options = new ArrayList<String>();
			options.add("4.3%");
			options.add("6.2%");
			options.add("5.7%");
			options.add("5.1%");
			cards.add(new GreenCard("What is the alcohol content by volume of Lagunitas IPA?", options, 2));

		options = new ArrayList<String>();
			options.add("Simon Street");
			options.add("Hymen Street");
			options.add("Bison Street");
			options.add("Zion Street");
			cards.add(new GreenCard("Where is the house of the parents of Andrew Kroenke?", options, 1));

		options = new ArrayList<String>();
			options.add("Paul Bunyan");
			options.add("Pecos Bill");
			options.add("John Henry");
			options.add("Brer Rabbit");
			cards.add(new GreenCard("Who said to his captain, [A man is nohing but a man, But before I let your steam drill beat me down, Id die with a hammer in my hand, Lord, Lord, Id die with a hammer in my hand.]", options, 3));

		options = new ArrayList<String>();
			options.add("Ireland");
			options.add("Saudi Arabia");
			options.add("South Korea");
			options.add("United States");
			cards.add(new GreenCard("Which country uses plug type C following the International Electrotechnical Commission standards?", options, 3));

		options = new ArrayList<String>();
			options.add("Silver");
			options.add("Black");
			options.add("Pink");
			options.add("White");
			cards.add(new GreenCard("Which of these is not an available color of iPhone?", options, 1));

		options = new ArrayList<String>();
			options.add("Divine Right of Kings");
			options.add("Popular Vote");
			options.add("Because Dana said so");
			options.add("The 10th Ammendment");
			cards.add(new GreenCard("What gives you the right?", options, 1));

		options = new ArrayList<String>();
			options.add("Yes");
			options.add("No");
			options.add("Maybe");
			options.add("Try again later");
			cards.add(new GreenCard("Do you like me?", options, 4));

		options = new ArrayList<String>();
			options.add("A dragon");
			options.add("Howard Stern");
			options.add("Griffin");
			options.add("Happy Rotter");
			cards.add(new GreenCard("Who do you think you are?", options, 1));

		options = new ArrayList<String>();
			options.add("Yes");
			options.add("No");
			options.add("That doesn't make sense");
			options.add("Dana, will you clean my glasses?");
			cards.add(new GreenCard("Do you want a house with more bathrooms than bedrooms?", options, 1));

		options = new ArrayList<String>();
			options.add("Because Dennis is a man bastard");
			options.add("Because Dennis is a bastard man");
			options.add("Because Denise is a woman bastard");
			options.add("This is a bad question");
			cards.add(new GreenCard("Dennis is idiot. Why Charlie hate?", options, 2));


	}

}