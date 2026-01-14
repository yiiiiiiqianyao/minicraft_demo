import * as THREE from "three";
import { collisionHelperMaterial } from "../engine/material";
import { Candidate } from "../physics/interface";

export class PhysicsHelper extends THREE.Group {
  constructor() {
    super();
  }

  // visualizes the block the player is colliding with
  addBlockCollisionHelper(candidate: Candidate) {
    const blockMesh = initBlockCollisionMesh(candidate);
    this.add(blockMesh);
  }

  /**
   * Visualizes the contact at the point 'p'
   */
  addContactPointerHelper(p: THREE.Vector3) {
    const contactMesh = initContactPointerMesh(p);
    this.add(contactMesh);
  }
}

// 辅助与 player 碰撞检测的方块的 helper
const collisionGeometry = new THREE.BoxGeometry(1.001, 1.001, 1.001);
function  initBlockCollisionMesh(candidate: Candidate) {
    const blockMesh = new THREE.Mesh(collisionGeometry, collisionHelperMaterial);
    blockMesh.position.copy(
      new THREE.Vector3(candidate.x, candidate.y, candidate.z)
    );
    return blockMesh;
}

const contactMaterial = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0x00ff00,
});
const contactGeometry = new THREE.SphereGeometry(0.05, 6, 6);
let contactMesh: THREE.Mesh | null = null;
/**
 * @desc 可视化碰撞点 'p'
 * Visualizes the contact at the point 'p'
 */
function initContactPointerMesh(p: THREE.Vector3) {
  if (!contactMesh) {
    contactMesh = new THREE.Mesh(contactGeometry, contactMaterial);
  }
  contactMesh.position.copy(new THREE.Vector3(p.x, p.y, p.z));
  return contactMesh;
}