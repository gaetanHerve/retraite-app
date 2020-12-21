export class Suggestion {
    public id: number;
    public category: string;
    public title: string;
    public image: string;
    public imageUrl: string;
    public link: string;

    public constructor() {
    }

    getId(): number {
        return this.id;
    }

    setId(value: number) {
        this.id = value;
    }

    getCategory(): string {
        return this.category;
    }

    setCategory(value: string) {
        this.category = value;
    }

    getTitle(): string {
        return this.title;
    }

    setTitle(value: string) {
        this.title = value;
    }

    getImage(): string {
        return this.image;
    }

    setImage(value: string) {
        this.image = value;
    }

    getImageUrl(): string {
        return this.imageUrl;
    }

    setImageUrl(value: string) {
        this.imageUrl = value;
    }

    getLink(): string {
        return this.link;
    }

    setLink(value: string) {
        this.link = value;
    }
}
