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
        artistTags: string[];
    }};
    ArtistProfilePage: { data: {
        userId: string;
        userName: string;
        userProfileImgAddress: string;
        userPreferenceTags: string[];
        userTags: string[];
        screen: string,
    }},
    LoginPage: undefined,
    InboxPage: undefined,
    ChatPage: {
        data: {
            userId: string;
            userName: string;
            userPhone: number;
            userProfileImgAddress: string;
            userPreferenceTags: string[];
            tags: string[];
        }
    },
    RegistrationPage: undefined,
    ProfilePage: undefined,
    UserSettings: undefined
  };
