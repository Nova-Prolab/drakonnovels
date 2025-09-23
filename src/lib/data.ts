import type { Novel } from './types';

const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam. Sorbi in justo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla dui. Fusce feugiat malesuada odio. Morbi nunc odio, gravida at, cursus nec, luctus a, lorem. Maecenas tristique, orci ac sem. Duis ultricies pharetra magna. Donec accumsan malesuada orci. Donec sit amet eros. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Mauris fermentum dictum magna. Sed laoreet aliquam leo. Ut tellus dolor, dapibus eget, elementum vel, cursus eleifend, elit. Aenean auctor wisi et urna. Aliquam erat volutpat. Duis ac turpis. Integer rutrum ante eu lacus.\n\nVestibulum libero nisl, porta vel, scelerisque eget, malesuada at, neque. Vivamus eget nibh. Etiam cursus leo vel metus. Nulla facilisi. Aenean nec eros. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Suspendisse sollicitudin velit sed leo. Ut pharetra augue nec augue. Nam elit agna,endrerit sit amet, tincidunt ac, viverra sed, nulla. Donec porta diam eu massa. Quisque diam lorem, interdum vitae,dapibus ac, scelerisque vitae, pede. Donec eget tellus non erat lacinia fermentum. Donec in velit vel ipsum auctor pulvinar. Proin ullamcorper urna et felis. Vestibulum iaculis lacinia est. Proin dictum elementum velit. Fusce euismod consequat ante. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Pellentesque sed dolor. Aliquam congue fermentum nisl. Mauris accumsan nulla vel diam. Sed in lacus ut enim adipiscing aliquet. Nulla venenatis. In pede mi, aliquet sit amet, euismod in,auctor ut, ligula. Aliquam dapibus tincidunt metus. Praesent justo dolor, lobortis quis, lobortis dignissim, pulvinar ac, lorem. Vestibulum sed ante. Donec sagittis euismod purus.";

export const novels: Novel[] = [
  {
    id: 'the-crimson-cipher',
    title: 'The Crimson Cipher',
    author: 'Elara Vance',
    coverImageId: 'novel-cover-1',
    tags: ['Fantasy', 'Mystery', 'Adventure'],
    chapters: [
      { id: 1, title: 'The Whispering Shadows', content: `The story begins. ${loremIpsum}` },
      { id: 2, title: 'A City of Secrets', content: `The plot thickens. ${loremIpsum}` },
      { id: 3, title: 'The Forgotten Key', content: `A discovery is made. ${loremIpsum}` },
    ],
  },
  {
    id: 'echoes-of-nebula',
    title: 'Echoes of Nebula',
    author: 'Kaelen Rourke',
    coverImageId: 'novel-cover-2',
    tags: ['Sci-Fi', 'Space Opera', 'Exploration'],
    chapters: [
      { id: 1, title: 'The Silent Void', content: `A lonely ship drifts through space. ${loremIpsum}` },
      { id: 2, title: 'First Contact', content: `An alien signal is detected. ${loremIpsum}` },
      { id: 3, title: 'Across the Stars', content: `A journey to an unknown world begins. ${loremIpsum}` },
      { id: 4, title: 'The Anomaly', content: `Something strange is found. ${loremIpsum}` },
    ],
  },
  {
    id: 'the-last-librarian',
    title: 'The Last Librarian',
    author: 'Fiona Gable',
    coverImageId: 'novel-cover-3',
    tags: ['Dystopian', 'Post-Apocalyptic', 'Mystery'],
    chapters: [
      { id: 1, title: 'A World Without Words', content: `Books are a forgotten relic. ${loremIpsum}` },
      { id: 2, title: 'The Hidden Archive', content: `A secret library is discovered. ${loremIpsum}` },
    ],
  },
    {
    id: 'the-kings-gambit',
    title: 'The King\'s Gambit',
    author: 'Arthur Pendelton',
    coverImageId: 'novel-cover-4',
    tags: ['Historical', 'Intrigue', 'War'],
    chapters: [
      { id: 1, title: 'The Royal Court', content: `Tensions rise in the kingdom. ${loremIpsum}` },
      { id: 2, title: 'A Declaration of War', content: `Armies march to battle. ${loremIpsum}` },
      { id: 3, title: 'The Siege of Blackwood', content: `A castle under attack. ${loremIpsum}` },
      { id: 4, title: 'Betrayal', content: `A traitor is revealed. ${loremIpsum}` },
      { id: 5, title: 'Checkmate', content: `The final move is made. ${loremIpsum}` },
    ],
  },
];
