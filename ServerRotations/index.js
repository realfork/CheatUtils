/// <reference types="../CTAutocomplete" />

/* 
    MADE BY FORK ON 11/01/2023 (github.com/realfork)
    This does not modify your movement or block interactions, you will have to handle those yourself to prevent possible bans.
    
    Usage:
    import ServerRotations from "ServerRotations"
    
    ServerRotations.set(yaw, pitch)
    ServerRotations.reset()
*/
class ServerRotations {
    constructor() {
        // Rotation Logic
        register("packetSent", (packet, event) => {
            if (!this.yaw || !this.pitch || Player.getPlayer().field_70154_o) return // If rotations aren't set or the player is riding an entity
            if (this.yaw == packet.func_149462_g() && this.pitch == packet.func_149470_h()) return // Don't process packet sent by server rotation

            // Cancel and send new packets with updated pitch and yaw
            cancel(event)
            if (packet.class.getSimpleName() == "C05PacketPlayerLook") Client.sendPacket(
                new net.minecraft.network.play.client.C03PacketPlayer$C05PacketPlayerLook(
                    this.yaw, 
                    this.pitch, 
                    Player.getPlayer().field_70122_E
                )
            )
            else Client.sendPacket(
                new net.minecraft.network.play.client.C03PacketPlayer$C06PacketPlayerPosLook(
                    Player.getX(), 
                    Player.getPlayer().func_174813_aQ().field_72338_b, 
                    Player.getZ(),
                    this.yaw,
                    this.pitch,
                    Player.getPlayer().field_70122_E
                )
            )
        }).setPacketClasses([net.minecraft.network.play.client.C03PacketPlayer$C05PacketPlayerLook, net.minecraft.network.play.client.C03PacketPlayer$C06PacketPlayerPosLook])
    
        // Rotate head and body models
        register("renderEntity", (entity) => {
            if (entity.getEntity() != Player.getPlayer() || !this.yaw || !this.pitch || Player.getPlayer().field_70154_o) return
            Player.getPlayer().field_70761_aq = this.yaw
            Player.getPlayer().field_70759_as = this.yaw
        })

        // Disable on unload
        register("gameUnload", this.reset)
    }

    // Set yaw and pitch
    set(yaw, pitch) {
        this.yaw = yaw
        this.pitch = pitch
    }

    // Reset
    reset() {
        this.yaw = null
        this.pitch = null
    }
}

export default new ServerRotations()