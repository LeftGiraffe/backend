import Step from "../models/step.model.js";

// ToDo: 언제 요청할 지가 중요!
export const getSteps = async (req, res) => {
  try {
    const userId = req.user._id;

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );

    const stepsData = await Step.findOne({
      userId: userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (!stepsData) {
      stepsData = new Step({
        userId: userId,
        date: now,
        step: 0,
      });

      await stepsData.save(); // 새로운 스텝 데이터 저장
      return res.status(201).json({
        message: "새로운 스텝 데이터가 생성되었습니다.",
        stepsData,
      });
    }

    res.status(200).json(stepsData);
  } catch (error) {
    console.log("Error in getSteps controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendSteps = async (req, res) => {
  try {
    const userId = req.user._id;
    const { stepsPerThirtyMinute } = req.body;

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );

    const stepsData = await Step.findOne({
      userId: userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });
    
    stepsData.step += stepsPerThirtyMinute;

    await stepsData.save();

    res.status(200).json({ message: "Steps updated successfully", stepsData });
  } catch (error) {
    console.log("Error in sendSteps controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
