export type RootStackParamList = {
    Home: undefined;
    DetailPage: { data: { 
        artId: string; 
        userId: string;
        userName: string;
        artTitle: string;
        artContent: string;
        artAddress: string;
        artTags: {type: [String], default: []};
        width: number;
        height: number;
    }; };
    RecPage: { data: {
        artistId: string,
        artistUsername: string,
        userId: string,
    }}
  };