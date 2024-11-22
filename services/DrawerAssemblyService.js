const Frame = require('../models/Frame');
const Drawer = require('../models/Drawer');

class DrawerAssemblyService {
    constructor() {
        this.MINIMUM_CLEARANCE = 3; // mm
        this.SLIDE_THICKNESS = 12.7; // mm
    }

    /**
      * Validates if a drawer can be installed in the given frame
      * @param {Frame} frame - The frame to install into
      * @param {Drawer} drawer - The drawer to be installed
      * @returns {Object} - Validation result with success flag and message
      */
    validateDrawerFit(frame, drawer) {
        if (!frame || !drawer) {
            throw new Error('Frame and drawer must be provided');
        }

        const availableWidth = frame.width - (2 * this.SLIDE_THICKNESS);
        const availableHeight = frame.height;
        const availableDepth = frame.depth;

        if (drawer.width > availableWidth - this.MINIMUM_CLEARANCE) {
            return {
                success: false,
                message: 'Drawer is too wide for frame considering slide clearance'
            };
        }

        if (drawer.height > availableHeight) {
            return {
                success: false,
                message: 'Drawer is too tall for frame'
            };
        }

        if (drawer.depth > availableDepth) {
            return {
                success: false,
                message: 'Drawer is too deep for frame'
            };
        }

        return {
            success: true,
            message: 'Drawer fits within frame specifications'
        };
    }

    /**
      * Calculates the mounting positions for drawer slides
      * @param {Frame} frame - The frame to install into
      * @param {Drawer} drawer - The drawer to be installed
      * @returns {Object} - Slide mounting positions
      */
    calculateSlidePositions(frame, drawer) {
        const leftSlideX = this.SLIDE_THICKNESS;
        const rightSlideX = frame.width - this.SLIDE_THICKNESS;
        const slideY = (frame.height - drawer.height) / 2;

        return {
            left: {
                x: leftSlideX,
                y: slideY,
                z: 0
            },
            right: {
                x: rightSlideX,
                y: slideY,
                z: 0
            }
        };
    }

    /**
      * Installs a drawer into a frame
      * @param {Frame} frame - The frame to install into
      * @param {Drawer} drawer - The drawer to be installed
      * @returns {Promise<Object>} - Installation result
      */
    async installDrawer(frame, drawer) {
        try {
            const validationResult = this.validateDrawerFit(frame, drawer);
            if (!validationResult.success) {
                throw new Error(validationResult.message);
            }

            const slidePositions = this.calculateSlidePositions(frame, drawer);

            // Update frame with slide positions
            await Frame.update({
                slidePositions: slidePositions,
                status: 'assembled'
            }, {
                where: { id: frame.id }
            });

            // Update drawer status
            await Drawer.update({
                status: 'installed',
            }, {
                where: { id: drawer.id }
            });

            return {
                success: true,
                message: 'Drawer successfully installed',
                slidePositions
            };
        } catch (error) {
            throw new Error(`Failed to install drawer: ${error.message}`);
        }
    }

    /**
      * Validates material compatibility between frame and drawer
      * @param {Frame} frame - The frame to install into
      * @param {Drawer} drawer - The drawer to be installed
      * @returns {boolean} - Whether materials are compatible
      */
    validateMaterialCompatibility(frame, drawer) {
        // Add specific material compatibility rules here
        const compatibleMaterials = {
            'wood': ['wood', 'mdf', 'plywood'],
            'metal': ['metal', 'steel', 'aluminum'],
            'plastic': ['plastic', 'composite']
        };

        const frameMaterialType = Object.keys(compatibleMaterials)
            .find(type => frame.material.toLowerCase().includes(type));

        if (!frameMaterialType) {
            return false;
        }

        return compatibleMaterials[frameMaterialType]
            .some(material => drawer.material.toLowerCase().includes(material));
    }
}

module.exports = DrawerAssemblyService;
