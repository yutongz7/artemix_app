export type RootStackParamList = {
    Home: { showOnboarding: boolean };
    OnboardingHomePage: { showOnboarding: boolean };
    OnboardingNavBar: undefined,
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
        userId: string;
        userName: string;
        userProfileImgAddress: string;
        userPreferenceTags: string[];
        userTags: string[];
    }};
    LoginPage: undefined,
    InboxPage: undefined,
    ChatPage: {
        data: {
            userId: string;
            userName: string;
            userProfileImgAddress: string;
            userPreferenceTags: string[];
            tags: string[];
        }
    };
    OnboardingPage1: undefined;
    OnboardingPage2: undefined;
    RegistrationPage: undefined;
    ProfilePage: undefined;
    UserSettings: undefined;
    PostPage: undefined;
  };
