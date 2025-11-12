import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const STORAGE_KEY = 'waifu-lang';

export const LANGUAGE_OPTIONS = [
    { value: 'en', labelKey: 'language.english' },
    { value: 'vi', labelKey: 'language.vietnamese' }
] as const;

const resources = {
    en: {
        translation: {
            language: {
                label: 'Language',
                english: 'English',
                vietnamese: 'Vietnamese'
            },
            nav: {
                dashboard: 'Dashboard',
                collection: 'Collection',
                gacha: 'Gacha',
                battle: 'Battle'
            },
            header: {
                title: '🌸 Waifu Card Game',
                logout: 'Log out',
                coinsLabel: 'Coins {{amount}}',
                gemsLabel: 'Gems {{amount}}',
                level: 'Lv.{{level}} {{username}}'
            },
            cards: {
                rarity: {
                    COMMON: 'Common',
                    RARE: 'Rare',
                    EPIC: 'Epic',
                    LEGENDARY: 'Legendary'
                },
                elements: {
                    FIRE: 'Fire',
                    WATER: 'Water',
                    EARTH: 'Earth',
                    AIR: 'Air',
                    LIGHT: 'Light',
                    DARK: 'Dark'
                }
            },
            common: {
                loading: 'Loading...',
                actions: {
                    cancel: 'Cancel',
                    cancelEdit: 'Cancel edit',
                    close: 'Close',
                    back: 'Go back',
                    goHome: 'Return home',
                    search: 'Search'
                },
                status: {
                    locked: 'Locked',
                    noDescription: 'No description provided.',
                    noDescriptionShort: 'No description',
                    untitledImage: 'Untitled image',
                    imageCount_one: '{{count}} image',
                    imageCount_other: '{{count}} images',
                    dialogues_one: '{{count}} dialogue line',
                    dialogues_other: '{{count}} dialogue lines'
                },
                messages: {
                    selectCard: 'Select a card to see its collections.',
                    loadingCollections: 'Loading collections...',
                    noCollections: 'This card does not have any curated collections yet.',
                    noCollectionsYet: 'No collections yet. Create the first one!',
                    noImages: 'This collection has no images yet.'
                },
                confirmations: {
                    deleteCard: 'Are you sure you want to delete this card?',
                    deleteCollection: 'Delete this collection? This will also remove its images.',
                    deleteImage: 'Delete this image?'
                }
            },
            auth: {
                signInTitle: 'Sign in',
                registerTitle: 'Create an account',
                usernameLabel: 'Username',
                usernamePlaceholder: 'Enter username',
                emailLabel: 'Email',
                emailPlaceholder: 'Enter email',
                passwordLabel: 'Password',
                passwordPlaceholder: 'Enter password',
                submitSignIn: 'Sign in',
                submitRegister: 'Create account',
                working: 'Working...',
                toggleNeedAccount: 'Need an account?',
                toggleHaveAccount: 'Already have an account?',
                toggleRegister: 'Register now',
                toggleSignIn: 'Sign in',
                error: 'Authentication failed'
            },
            dashboard: {
                welcome: 'Welcome back, {{name}}!',
                levelStatus: 'Level {{level}} - {{xp}} EXP',
                currency: {
                    coins: 'Coins',
                    gems: 'Gems'
                },
                sections: {
                    gacha: {
                        title: 'Gacha',
                        description: 'Pull new cards and expand your collection!',
                        action: 'Go to Gacha'
                    },
                    collection: {
                        title: 'Collection',
                        description: 'Review and manage every card you own.',
                        action: 'View Collection'
                    },
                    battle: {
                        title: 'Battle',
                        description: 'Challenge other players to card duels.',
                        action: 'Start a Battle'
                    },
                    stats: {
                        title: 'Stats',
                        level: 'Level: {{level}}',
                        experience: 'Experience: {{xp}}'
                    }
                }
            },
            collection: {
                title: 'Card Collection',
                loading: 'Loading your collection...',
                filters: {
                    label: 'Filter',
                    all: 'All ({{count}})',
                    owned: 'Owned ({{count}})',
                    missing: 'Missing ({{count}})',
                    rarities: {
                        COMMON: 'Common',
                        RARE: 'Rare',
                        EPIC: 'Epic',
                        LEGENDARY: 'Legendary'
                    }
                },
                sort: {
                    label: 'Sort',
                    name: 'Name',
                    attack: 'Attack',
                    defense: 'Defense',
                    cost: 'Cost',
                    rarity: 'Rarity'
                },
                showing: 'Showing {{count}} cards',
                stats: {
                    attack: 'ATK {{value}}',
                    defense: 'DEF {{value}}',
                    cost: 'COST {{value}}'
                },
                empty: 'No cards match the selected filters.',
                explore: {
                    title: 'Explore Card Collections',
                    description: 'These datasets come from the {{cardEndpoint}} and {{collectionsEndpoint}} backend endpoints.',
                    selectLabel: 'Choose a card to see its curated collections',
                    placeholder: 'Select a card',
                    loading: 'Loading collections...',
                    error: 'Unable to load collections for this card right now.',
                    none: 'This card does not have any curated collections yet.',
                    descriptionFallback: 'No description provided.',
                    imageCount_one: '{{count}} image',
                    imageCount_other: '{{count}} images',
                    imageTitleFallback: 'Untitled image',
                    imageDescriptionFallback: 'No description',
                    dialogueCount_one: '{{count}} dialogue line',
                    dialogueCount_other: '{{count}} dialogue lines'
                },
                search: {
                    title: 'Search Collections by Name',
                    placeholder: 'Enter collection name',
                    validation: 'Enter a collection name to search.',
                    searching: 'Searching...',
                    button: 'Search',
                    error: 'Unable to search collections right now.',
                    noResults: 'No collections found with that name.',
                    imageCount_one: 'Images: {{count}}',
                    imageCount_other: 'Images: {{count}}'
                }
            },
            gacha: {
                title: 'Gacha System',
                results: {
                    title: 'Gacha Results',
                    summary: 'You pulled {{count}} new cards!',
                    cost: 'Cost: {{amount}} {{currency}}',
                    remaining: 'Remaining: {{coins}} coins | {{gems}} gems',
                    pullAgain: 'Pull Again',
                    viewCollection: 'View Collection'
                },
                currency: {
                    coinsLabel: 'Coins {{amount}}',
                    gemsLabel: 'Gems {{amount}}',
                    coinName: 'coins',
                    gemName: 'gems'
                },
                rewards: {
                    title: 'Gacha Rewards',
                    points: [
                        'Single pull: 100 coins or 1 gem',
                        'Ten pull: 900 coins or 9 gems',
                        'Ten pull guarantees at least one Rare card',
                        'Use coins first to save gems for events'
                    ]
                },
                single: {
                    title: 'Single Pull',
                    description: 'Grab a random card with instant delivery.',
                    coinButton: '{{amount}} Coins',
                    gemButton_one: '{{count}} Gem',
                    gemButton_other: '{{count}} Gems'
                },
                ten: {
                    title: 'Ten Pull',
                    description: 'Ten cards plus a guaranteed Rare or better.',
                    coinButton: '{{amount}} Coins',
                    gemButton_one: '{{count}} Gem',
                    gemButton_other: '{{count}} Gems',
                    coinSavings: 'Save 100 coins',
                    gemSavings: 'Save 1 gem'
                },
                buttons: {
                    processing: 'Processing...'
                },
                errors: {
                    notEnough: 'Not enough {{currency}}. You need {{cost}}.',
                    generic: 'Something went wrong while running gacha.'
                }
            },
            battle: {
                title: '⚔️ Battle Arena',
                alert: 'Battle mode is still in development. Stay tuned!',
                pvpTitle: 'PvP Card Battles',
                description: 'Challenge other players with your deck!\nThis feature is under active development and will arrive soon.',
                button: {
                    searching: 'Searching for an opponent...',
                    findMatch: 'Find a Match'
                },
                comingSoon: {
                    title: '🛠️ Coming soon',
                    items: [
                        'Real-time multiplayer battles',
                        'Turn-based card gameplay',
                        'Ranking system',
                        'Battle rewards',
                        'Deck building strategy'
                    ]
                }
            },
            admin: {
                cardsHeading: 'Card Management',
                galleriesHeading: 'Gallery Management',
                nav: {
                    cardManager: 'Card Manager',
                    galleryManager: 'Gallery Manager'
                }
            },
            cardManager: {
                loading: 'Loading cards...',
                title: 'Card Management',
                add: 'Add New Card',
                errors: {
                    load: 'Failed to load cards',
                    create: 'Failed to create card',
                    update: 'Failed to update card',
                    delete: 'Failed to delete card'
                },
                form: {
                    editTitle: 'Edit Card',
                    createTitle: 'Create New Card',
                    fields: {
                        name: 'Name *',
                        image: 'Card Image',
                        imagePreview: 'Image Preview:',
                        description: 'Description',
                        rarity: 'Rarity *',
                        element: 'Element *',
                        attack: 'Attack *',
                        defense: 'Defense *',
                        cost: 'Cost *'
                    },
                    buttons: {
                        cancel: 'Cancel',
                        create: 'Create Card',
                        update: 'Update Card'
                    }
                },
                list: {
                    attack: 'ATK',
                    defense: 'DEF',
                    cost: 'Cost',
                    edit: 'Edit',
                    delete: 'Delete',
                    empty: 'No cards found. Create your first card!'
                }
            },
            gallery: {
                selectLabel: 'Select a card to manage its galleries',
                selectPlaceholder: '-- Choose a card --',
                cardInfo: {
                    rarity: 'Rarity',
                    element: 'Element'
                },
                actions: {
                    create: 'Create Collection',
                    cancel: 'Cancel',
                    cancelEdit: 'Cancel edit'
                },
                form: {
                    newTitle: 'New Collection',
                    editTitle: 'Edit Collection',
                    namePlaceholder: 'Collection name',
                    descriptionPlaceholder: 'Description (optional)',
                    buttonCreate: 'Create Collection',
                    buttonUpdate: 'Update Collection',
                    saving: 'Saving...'
                },
                messages: {
                    selectCard: 'Select a card to see its collections.',
                    loading: 'Loading collections...',
                    none: 'No collections yet. Create the first one!',
                    error: 'Unable to load collections for this card.',
                    cardsError: 'Unable to load cards right now.',
                    requiredName: 'Collection name is required.',
                    requiredImageUrl: 'Image URL is required.',
                    cannotDelete: 'Unable to delete collection right now.',
                    cannotDeleteImage: 'Unable to delete image right now.',
                    saveCollection: 'Unable to save collection.',
                    saveImage: 'Unable to save image.'
                },
                collection: {
                    open: 'Open Gallery',
                    hide: 'Hide Gallery',
                    edit: 'Edit',
                    delete: 'Delete',
                    imagesLabel: 'Images: {{count}}'
                },
                imageForm: {
                    title: 'Add Image',
                    editTitle: 'Edit Image',
                    urlPlaceholder: 'Image URL',
                    titlePlaceholder: 'Title',
                    descriptionPlaceholder: 'Description',
                    orderLabel: 'Display order',
                    addButton: 'Add Image',
                    updateButton: 'Update Image',
                    saving: 'Saving...',
                    cancelEdit: 'Cancel edit'
                }
            },
            notFound: {
                title: 'Page not found',
                description: 'Sorry, the page you are looking for does not exist.\nThe link may have changed or been removed.',
                home: '🏠 Return to dashboard',
                back: '⤴️ Go back',
                emoji: '🌸'
            }
        }
    },
    vi: {
        translation: {
            language: {
                label: 'Ngôn ngữ',
                english: 'Tiếng Anh',
                vietnamese: 'Tiếng Việt'
            },
            nav: {
                dashboard: 'Bảng điều khiển',
                collection: 'Bộ sưu tập',
                gacha: 'Gacha',
                battle: 'Đấu thẻ'
            },
            header: {
                title: '🌸 Waifu Card Game',
                logout: 'Đăng xuất',
                coinsLabel: 'Xu {{amount}}',
                gemsLabel: 'Ngọc {{amount}}',
                level: 'Lv.{{level}} {{username}}'
            },
            cards: {
                rarity: {
                    COMMON: 'Phổ thông',
                    RARE: 'Hiếm',
                    EPIC: 'Sử thi',
                    LEGENDARY: 'Huyền thoại'
                },
                elements: {
                    FIRE: 'Hỏa',
                    WATER: 'Thủy',
                    EARTH: 'Thổ',
                    AIR: 'Phong',
                    LIGHT: 'Quang',
                    DARK: 'Ám'
                }
            },
            common: {
                loading: 'Đang tải...',
                actions: {
                    cancel: 'Hủy',
                    cancelEdit: 'Hủy chỉnh sửa',
                    close: 'Đóng',
                    back: 'Quay lại',
                    goHome: 'Về trang chủ',
                    search: 'Tìm kiếm'
                },
                status: {
                    locked: 'Đã khóa',
                    noDescription: 'Chưa có mô tả.',
                    noDescriptionShort: 'Chưa có mô tả',
                    untitledImage: 'Ảnh chưa đặt tên',
                    imageCount_one: '{{count}} ảnh',
                    imageCount_other: '{{count}} ảnh',
                    dialogues_one: '{{count}} dòng hội thoại',
                    dialogues_other: '{{count}} dòng hội thoại'
                },
                messages: {
                    selectCard: 'Chọn một thẻ để xem các bộ sưu tập của nó.',
                    loadingCollections: 'Đang tải bộ sưu tập...',
                    noCollections: 'Thẻ này chưa có bộ sưu tập nào.',
                    noCollectionsYet: 'Chưa có bộ sưu tập nào. Hãy tạo bộ đầu tiên!',
                    noImages: 'Bộ sưu tập này chưa có ảnh.'
                },
                confirmations: {
                    deleteCard: 'Bạn có chắc muốn xóa thẻ này không?',
                    deleteCollection: 'Xóa bộ sưu tập này? Thao tác sẽ xóa luôn các ảnh bên trong.',
                    deleteImage: 'Xóa ảnh này?'
                }
            },
            auth: {
                signInTitle: 'Đăng nhập',
                registerTitle: 'Tạo tài khoản',
                usernameLabel: 'Tên đăng nhập',
                usernamePlaceholder: 'Nhập tên đăng nhập',
                emailLabel: 'Email',
                emailPlaceholder: 'Nhập email',
                passwordLabel: 'Mật khẩu',
                passwordPlaceholder: 'Nhập mật khẩu',
                submitSignIn: 'Đăng nhập',
                submitRegister: 'Tạo tài khoản',
                working: 'Đang xử lý...',
                toggleNeedAccount: 'Cần tài khoản?',
                toggleHaveAccount: 'Đã có tài khoản?',
                toggleRegister: 'Đăng ký ngay',
                toggleSignIn: 'Đăng nhập',
                error: 'Xác thực thất bại'
            },
            dashboard: {
                welcome: 'Chào mừng trở lại, {{name}}!',
                levelStatus: 'Cấp {{level}} - {{xp}} EXP',
                currency: {
                    coins: 'Xu',
                    gems: 'Ngọc'
                },
                sections: {
                    gacha: {
                        title: 'Gacha',
                        description: 'Mở thẻ mới và mở rộng bộ sưu tập của bạn!',
                        action: 'Đi đến Gacha'
                    },
                    collection: {
                        title: 'Bộ sưu tập',
                        description: 'Xem và quản lý toàn bộ thẻ bạn sở hữu.',
                        action: 'Xem bộ sưu tập'
                    },
                    battle: {
                        title: 'Đấu thẻ',
                        description: 'Thách đấu người chơi khác trong các trận bài.',
                        action: 'Bắt đầu trận đấu'
                    },
                    stats: {
                        title: 'Thống kê',
                        level: 'Cấp độ: {{level}}',
                        experience: 'Kinh nghiệm: {{xp}}'
                    }
                }
            },
            collection: {
                title: 'Bộ sưu tập thẻ',
                loading: 'Đang tải bộ sưu tập của bạn...',
                filters: {
                    label: 'Bộ lọc',
                    all: 'Tất cả ({{count}})',
                    owned: 'Đã sở hữu ({{count}})',
                    missing: 'Thiếu ({{count}})',
                    rarities: {
                        COMMON: 'Phổ thông',
                        RARE: 'Hiếm',
                        EPIC: 'Sử thi',
                        LEGENDARY: 'Huyền thoại'
                    }
                },
                sort: {
                    label: 'Sắp xếp',
                    name: 'Tên',
                    attack: 'Tấn công',
                    defense: 'Phòng thủ',
                    cost: 'Chi phí',
                    rarity: 'Độ hiếm'
                },
                showing: 'Đang hiển thị {{count}} thẻ',
                stats: {
                    attack: 'ATK {{value}}',
                    defense: 'DEF {{value}}',
                    cost: 'COST {{value}}'
                },
                empty: 'Không có thẻ nào phù hợp với bộ lọc đã chọn.',
                explore: {
                    title: 'Khám phá bộ sưu tập thẻ',
                    description: 'Dữ liệu được lấy từ endpoint backend {{cardEndpoint}} và {{collectionsEndpoint}}.',
                    selectLabel: 'Chọn một thẻ để xem các bộ sưu tập được tuyển chọn',
                    placeholder: 'Chọn thẻ',
                    loading: 'Đang tải bộ sưu tập...',
                    error: 'Không thể tải bộ sưu tập cho thẻ này.',
                    none: 'Thẻ này chưa có bộ sưu tập nào.',
                    descriptionFallback: 'Chưa có mô tả.',
                    imageCount_one: '{{count}} ảnh',
                    imageCount_other: '{{count}} ảnh',
                    imageTitleFallback: 'Ảnh chưa đặt tên',
                    imageDescriptionFallback: 'Chưa có mô tả',
                    dialogueCount_one: '{{count}} dòng hội thoại',
                    dialogueCount_other: '{{count}} dòng hội thoại'
                },
                search: {
                    title: 'Tìm bộ sưu tập theo tên',
                    placeholder: 'Nhập tên bộ sưu tập',
                    validation: 'Vui lòng nhập tên bộ sưu tập để tìm.',
                    searching: 'Đang tìm kiếm...',
                    button: 'Tìm kiếm',
                    error: 'Không thể tìm kiếm bộ sưu tập lúc này.',
                    noResults: 'Không tìm thấy bộ sưu tập nào phù hợp.',
                    imageCount_one: 'Ảnh: {{count}}',
                    imageCount_other: 'Ảnh: {{count}}'
                }
            },
            gacha: {
                title: 'Hệ thống gacha',
                results: {
                    title: 'Kết quả gacha',
                    summary: 'Bạn đã nhận {{count}} thẻ mới!',
                    cost: 'Chi phí: {{amount}} {{currency}}',
                    remaining: 'Còn lại: {{coins}} xu | {{gems}} ngọc',
                    pullAgain: 'Mở tiếp',
                    viewCollection: 'Xem bộ sưu tập'
                },
                currency: {
                    coinsLabel: 'Xu {{amount}}',
                    gemsLabel: 'Ngọc {{amount}}',
                    coinName: 'xu',
                    gemName: 'ngọc'
                },
                rewards: {
                    title: 'Phần thưởng gacha',
                    points: [
                        'Mở 1 lần: 100 xu hoặc 1 ngọc',
                        'Mở 10 lần: 900 xu hoặc 9 ngọc',
                        'Mở 10 lần đảm bảo ít nhất 1 thẻ Hiếm',
                        'Ưu tiên dùng xu để dành ngọc cho sự kiện'
                    ]
                },
                single: {
                    title: 'Mở 1 lần',
                    description: 'Nhận ngẫu nhiên một thẻ ngay lập tức.',
                    coinButton: '{{amount}} xu',
                    gemButton_one: '{{count}} ngọc',
                    gemButton_other: '{{count}} ngọc'
                },
                ten: {
                    title: 'Mở 10 lần',
                    description: '10 thẻ và đảm bảo ít nhất 1 thẻ Hiếm trở lên.',
                    coinButton: '{{amount}} xu',
                    gemButton_one: '{{count}} ngọc',
                    gemButton_other: '{{count}} ngọc',
                    coinSavings: 'Tiết kiệm 100 xu',
                    gemSavings: 'Tiết kiệm 1 ngọc'
                },
                buttons: {
                    processing: 'Đang xử lý...'
                },
                errors: {
                    notEnough: 'Không đủ {{currency}}. Bạn cần {{cost}}.',
                    generic: 'Đã có lỗi khi quay gacha.'
                }
            },
            battle: {
                title: '⚔️ Đấu Thẻ',
                alert: 'Chức năng đấu thẻ vẫn đang được phát triển. Vui lòng chờ!',
                pvpTitle: 'Đấu Thẻ PvP',
                description: 'Thách đấu người chơi khác bằng bộ thẻ của bạn!\nTính năng này đang được phát triển và sẽ sớm ra mắt.',
                button: {
                    searching: 'Đang tìm đối thủ...',
                    findMatch: 'Tìm trận đấu'
                },
                comingSoon: {
                    title: '🛠️ Tính năng sắp ra mắt',
                    items: [
                        'PvP thời gian thực',
                        'Lối chơi thẻ theo lượt',
                        'Hệ thống xếp hạng',
                        'Phần thưởng trận đấu',
                        'Xây dựng bộ thẻ chiến thuật'
                    ]
                }
            },
            admin: {
                cardsHeading: 'Quản lý thẻ bài',
                galleriesHeading: 'Quản lý thư viện ảnh',
                nav: {
                    cardManager: 'Quản lý thẻ',
                    galleryManager: 'Quản lý thư viện'
                }
            },
            cardManager: {
                loading: 'Đang tải danh sách thẻ...',
                title: 'Quản lý thẻ',
                add: 'Thêm thẻ mới',
                errors: {
                    load: 'Không thể tải danh sách thẻ',
                    create: 'Không thể tạo thẻ',
                    update: 'Không thể cập nhật thẻ',
                    delete: 'Không thể xóa thẻ'
                },
                form: {
                    editTitle: 'Chỉnh sửa thẻ',
                    createTitle: 'Tạo thẻ mới',
                    fields: {
                        name: 'Tên *',
                        image: 'Ảnh thẻ',
                        imagePreview: 'Xem trước ảnh:',
                        description: 'Mô tả',
                        rarity: 'Độ hiếm *',
                        element: 'Nguyên tố *',
                        attack: 'Tấn công *',
                        defense: 'Phòng thủ *',
                        cost: 'Chi phí *'
                    },
                    buttons: {
                        cancel: 'Hủy',
                        create: 'Tạo thẻ',
                        update: 'Cập nhật thẻ'
                    }
                },
                list: {
                    attack: 'ATK',
                    defense: 'DEF',
                    cost: 'Chi phí',
                    edit: 'Sửa',
                    delete: 'Xóa',
                    empty: 'Chưa có thẻ nào. Hãy tạo thẻ đầu tiên!'
                }
            },
            gallery: {
                selectLabel: 'Chọn thẻ để quản lý thư viện của nó',
                selectPlaceholder: '-- Chọn thẻ --',
                cardInfo: {
                    rarity: 'Độ hiếm',
                    element: 'Nguyên tố'
                },
                actions: {
                    create: 'Tạo bộ sưu tập',
                    cancel: 'Hủy',
                    cancelEdit: 'Hủy chỉnh sửa'
                },
                form: {
                    newTitle: 'Bộ sưu tập mới',
                    editTitle: 'Chỉnh sửa bộ sưu tập',
                    namePlaceholder: 'Tên bộ sưu tập',
                    descriptionPlaceholder: 'Mô tả (không bắt buộc)',
                    buttonCreate: 'Tạo bộ sưu tập',
                    buttonUpdate: 'Cập nhật bộ sưu tập',
                    saving: 'Đang lưu...'
                },
                messages: {
                    selectCard: 'Chọn một thẻ để xem các bộ sưu tập.',
                    loading: 'Đang tải bộ sưu tập...',
                    none: 'Chưa có bộ sưu tập nào. Hãy tạo bộ đầu tiên!',
                    error: 'Không thể tải bộ sưu tập cho thẻ này.',
                    cardsError: 'Không thể tải danh sách thẻ lúc này.',
                    requiredName: 'Cần nhập tên bộ sưu tập.',
                    requiredImageUrl: 'Cần nhập đường dẫn ảnh.',
                    cannotDelete: 'Không thể xóa bộ sưu tập lúc này.',
                    cannotDeleteImage: 'Không thể xóa ảnh lúc này.',
                    saveCollection: 'Không thể lưu bộ sưu tập.',
                    saveImage: 'Không thể lưu ảnh.'
                },
                collection: {
                    open: 'Mở thư viện',
                    hide: 'Ẩn thư viện',
                    edit: 'Chỉnh sửa',
                    delete: 'Xóa',
                    imagesLabel: 'Ảnh: {{count}}'
                },
                imageForm: {
                    title: 'Thêm ảnh',
                    editTitle: 'Chỉnh sửa ảnh',
                    urlPlaceholder: 'Đường dẫn ảnh',
                    titlePlaceholder: 'Tiêu đề',
                    descriptionPlaceholder: 'Mô tả',
                    orderLabel: 'Thứ tự hiển thị',
                    addButton: 'Thêm ảnh',
                    updateButton: 'Cập nhật ảnh',
                    saving: 'Đang lưu...',
                    cancelEdit: 'Hủy chỉnh sửa'
                }
            },
            notFound: {
                title: 'Trang không tồn tại',
                description: 'Rất tiếc, trang bạn tìm kiếm không tồn tại.\nCó thể đường dẫn đã được thay đổi hoặc xóa.',
                home: '🏠 Về trang chủ',
                back: '⤴️ Quay lại',
                emoji: '🌸'
            }
        }
    }
} as const;

const storedLanguage = (() => {
    if (typeof window === 'undefined') {
        return null;
    }
    return window.localStorage.getItem(STORAGE_KEY);
})();

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: storedLanguage || 'vi',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

i18n.on('languageChanged', (lng) => {
    if (typeof window === 'undefined') {
        return;
    }
    window.localStorage.setItem(STORAGE_KEY, lng);
});

export default i18n;
