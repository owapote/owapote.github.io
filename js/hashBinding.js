export class HashBinding {
    constructor() {
        this.hasBound = false;
    }

    ApplyBindingsOnce(json, targetNode) {
        if (!this.hasBound) {
            ko.applyBindings(json, targetNode);
            this.hasBound = true;
        }
    }

    RemoveBinding(targetNode){
        if(this.hasBound){
            ko.cleanNode(targetNode);
            this.hasBound = false;
        }
    }
}