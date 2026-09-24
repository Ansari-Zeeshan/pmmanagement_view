import { User } from '../user/user.model.js';
import { Organization } from '../organization/organization.model.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('organizationId');
    return ApiResponse.success(res, user, 'Current user profile fetched successfully.');
  } catch (error) {
    return ApiResponse.error(res, 'AUTH_ERROR', error.message, 500);
  }
};

export const registerOrganization = async (req, res) => {
  try {
    const { orgName, orgCode, adminName, adminEmail } = req.body;
    
    let org = await Organization.findOne({ code: orgCode.toUpperCase() });
    if (org) {
      return ApiResponse.error(res, 'ORG_EXISTS', 'Organization code already registered.', 400);
    }

    org = await Organization.create({
      name: orgName,
      code: orgCode.toUpperCase(),
      createdBy: req.user?._id,
    });

    return ApiResponse.success(res, org, 'Organization created successfully.', 201);
  } catch (error) {
    return ApiResponse.error(res, 'ORG_CREATE_ERROR', error.message, 500);
  }
};
