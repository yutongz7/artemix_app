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
        artistProfileImgAddress: string,
        artistPreferenceTags: string[],
        userId: string,
        artId: string;
        artisName: string;
        artTitle: string;
        artContent: string;
        artAddress: string;
        artTags: {type: [String], default: []};
        width: number;
        height: number;
    }};
    ArtistProfilePage: undefined,
    LoginPage: undefined,
    InboxPage: undefined,
    ChatPage: undefined,
    RegistrationPage: undefined,
  };