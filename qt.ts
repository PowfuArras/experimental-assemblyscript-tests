type AABB = { x1: number, y1: number, x2: number, y2: number };
export class QuadTree {
    x: number;
    y: number;
    size: number;
    level: number;
    children: QuadTree[];
    entities: Entity[];

    constructor(x: number, y: number, size: number, level: number) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.level = level;
        this.children = [];
        this.entities = [];
    }

    getChildren(AABB: AABB): boolean[] {
        const output = [false, false, false, false];
        const x = this.x + this.size * 0.5;
        const y = this.y + this.size * 0.5;
        const left = AABB.x1 < x;
        const right = AABB.x2 > x;
        if (AABB.y1 < y) {
            if (left) output[0] = true;
            if (right) output[1] = true;
        }
        if (AABB.y2 > y) {
            if (left) output[2] = true;
            if (right) output[3] = true;
        }

        return output;
    }

    split(): void {
        const nextLevel = this.level - 1;
        const size = this.size * 0.5;
        this.children = [
            new QuadTree(this.x, this.y, size, nextLevel),
            new QuadTree(this.x + size, this.y, size, nextLevel),
            new QuadTree(this.x, this.y + size, size, nextLevel),
            new QuadTree(this.x + size, this.y + size, size, nextLevel)
        ];
        this.entities.forEach(entity => {
            const branches = this.getChildren(entity.AABB);
            if (branches[0]) this.children[0].insert(entity);
            if (branches[1]) this.children[1].insert(entity);
            if (branches[2]) this.children[2].insert(entity);
            if (branches[3]) this.children[3].insert(entity);
        });
    }

    insert(entity: Entity): void {
        if (this.children.length > 0) {
            const branches = this.getChildren(entity.AABB);
            if (branches[0]) this.children[0].insert(entity);
            if (branches[1]) this.children[1].insert(entity);
            if (branches[2]) this.children[2].insert(entity);
            if (branches[3]) this.children[3].insert(entity);
            return;
        }

        this.entities.push(entity);
        if (this.entities.length > 4 && this.level > 0) this.split();
    }

    query(AABB: AABB): Entity[] {
        if (this.children.length > 0) {
            const output = [];
            const branches = this.getChildren(AABB);
            if (branches[0]) output.push(...this.children[0].query(AABB));
            if (branches[1]) output.push(...this.children[1].query(AABB));
            if (branches[2]) output.push(...this.children[2].query(AABB));
            if (branches[3]) output.push(...this.children[3].query(AABB));
            return output;
        }

        return this.entities;
    }

    clear(): void {
        this.children = [];
        this.entities = [];
    }
}