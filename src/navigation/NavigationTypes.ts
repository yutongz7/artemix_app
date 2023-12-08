export type RootStackParamList = {
    Home: { showOnboarding: boolean };
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
    ArtistProfilePage: { data: {
        _id: string;
        userId: string;
        userName: string;
        userPassword: string;
        userEmail: string;
        userPhone: number;
        userProfileImgAddress: string;
        userPreferenceTags: string[];
        tags: string[];
    }},
    LoginPage: undefined,
    InboxPage: undefined,
    ChatPage: {
        data: {
            _id: string;
            userId: string;
            userName: string;
            userPassword: string;
            userEmail: string;
            userPhone: number;
            userProfileImgAddress: string;
            userPreferenceTags: string[];
            tags: string[];
        }
    },
    RegistrationPage: undefined,
    ProfilePage: undefined,
    UserSettings: undefined,
    PostPage: undefined
  };
